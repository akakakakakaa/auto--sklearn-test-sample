import sklearn
import autosklearn
from autosklearn.classification import AutoSklearnClassifier
from autosklearn.regression import AutoSklearnRegressor
from autosklearn.metrics import CLASSIFICATION_METRICS, REGRESSION_METRICS
import multiprocessing
from smac.runhistory.runhistory import RunHistory
from typing import List, Dict
import pandas as pd
import threading


class AutosklearnWrapper:
  def __init__(
    self,
    algorithm: str,
    training_time: int,
    memory_limit: int,
    dataset_name: str,
    metric: str,
    estimators: List[str]=None,
    preprocessors: List[str]=None,
    tmp_folder: str=None,
    out_folder: str=None,
    n_jobs: int=None
  ):
    self.algorithm = algorithm.lower()

    # check algorithm and allocate scoring function
    if algorithm == "classification":
      self.autosklearnEstimator = AutoSklearnClassifier
      self.scoring_functions = [scorer for metric, scorer in CLASSIFICATION_METRICS.items()]
    elif algorithm == "regression":
      self.autosklearnEstimator = AutoSklearnRegressor
      self.scoring_functions = [scorer for metric, scorer in REGRESSION_METRICS.items()]
    else:
      raise ValueError("algorithm only support classification or regression.")

    # check is metric exists in scoring function
    metric = metric.lower()
    score_f_names = [f.name.lower() for f in self.scoring_functions]
    if metric not in score_f_names:
      metrics_list = ", ".join(score_f_names)
      raise ValueError("metric must use in [" + metrics_list + "]")

    # allocate metric
    for scoring_function in self.scoring_functions:
      if scoring_function.name.lower() == metric:
        self.metric = scoring_function
        break

    self.training_time = training_time
    self.memory_limit = memory_limit
    self.dataset_name = dataset_name
    self.estimators = estimators
    self.preprocessors = preprocessors
    self.tmp_folder = tmp_folder
    self.out_folder = out_folder
    self.n_jobs = n_jobs
    self.status = "Creating"
    self.thread = None


  def fit(
    self, 
    df: pd.DataFrame,
    target_column: str
  ):
    if target_column not in df.columns:
      column_list = ", ".join(df.columns)
      raise ValueError(target_column + " not exists in data columns. (Data Columns: [" + column_list + "]")

    # this history contain's almost every autosklearn information.
    self.runhistory = RunHistory()

    def get_smac_object_callback(budget_type):
      def get_smac_object(
        scenario_dict,
        seed,
        ta,
        ta_kwargs,
        metalearning_configurations,
        n_jobs,
        dask_client,
      ):
        from smac.facade.hyperband_facade import HB4AC
        from smac.facade.roar_facade import ROAR
        from smac.facade.smac_ac_facade import SMAC4AC
        from smac.intensification.successive_halving import SuccessiveHalving
        from smac.scenario.scenario import Scenario

        if n_jobs > 1 or (dask_client and len(dask_client.nthreads()) > 1):
          raise ValueError("Please make sure to guard the code invoking Auto-sklearn by "
                          "`if __name__ == '__main__'` and remove this exception.")

        scenario = Scenario(scenario_dict)
        if len(metalearning_configurations) > 0:
            default_config = scenario.cs.get_default_configuration()
            initial_configurations = [default_config] + metalearning_configurations
        else:
            initial_configurations = None

        ta_kwargs['budget_type'] = budget_type

        return HB4AC(
            scenario=scenario,
            rng=seed,
            tae_runner=ta,
            tae_runner_kwargs=ta_kwargs,
            initial_design=None,
            initial_configurations=initial_configurations,
            runhistory=self.runhistory,
            run_id=seed,
            intensifier=SuccessiveHalving,
            # TODO: how to handle intensifier_kwargs?
            intensifier_kwargs={
               'initial_budget': 10.0,
               'max_budget': 100,
               'eta': 2,
               'min_chall': 1},
            n_jobs=n_jobs,
            dask_client=dask_client,
        )
      return get_smac_object

    automl = self.autosklearnEstimator(
        time_left_for_this_task=self.training_time,
        per_run_time_limit=None,
        initial_configurations_via_metalearning=25,
        ensemble_size=0,
        ensemble_nbest=0,
        max_models_on_disc=10,
        seed=1,
        memory_limit=self.memory_limit,
        include_estimators=self.estimators,
        exclude_estimators=None,
        include_preprocessors=self.preprocessors,
        exclude_preprocessors=None,
        resampling_strategy='holdout',
        resampling_strategy_arguments=None,
        tmp_folder=self.tmp_folder,
        output_folder=self.out_folder,
        delete_tmp_folder_after_terminate=True,
        delete_output_folder_after_terminate=False,
        n_jobs=self.n_jobs,
        dask_client=None,
        disable_evaluator_output=True,
        get_smac_object_callback=get_smac_object_callback("iterations"),
        smac_scenario_args=None,
        logging_config=None,
        metadata_directory=None,
        metric=self.metric,
        scoring_functions=self.scoring_functions,
        load_models=False
    )

    def run_automl(df):
      def refine_df(raw: pd.DataFrame):
        row_len = len(raw.index)

        drop_columns = []
        for col in raw:
          if raw[col].dtype == object:
            unique_val = raw[col].nunique()

            if unique_val / row_len > 0.1:
              drop_columns.append(col)
            else:
              raw[col] = raw[col].astype('category')

        raw = raw.drop(drop_columns, axis=1)
        return raw

      df = refine_df(df)

      y = df.pop(target_column)
      X = df

      X_train, X_test, y_train, y_test = \
          sklearn.model_selection.train_test_split(X, y, random_state=1)
      automl.fit(X_train, y_train, X_test, y_test, dataset_name=self.dataset_name)
      self.status = "Finished"

    self.thread = threading.Thread(target=run_automl, args=(df, ))
    self.thread.start()
    self.status = "Running"

  def get_history(self) -> Dict:
    infos = {}

    def get_metric_val(metric, cost):
        return metric._optimum - (metric._sign * cost)

    for key, val in self.runhistory.data.items():
        config_dict = self.runhistory.ids_config[key.config_id].get_dictionary()
        if "classifier:__choice__" in config_dict:
          estimators = config_dict["classifier:__choice__"]
        else:
          estimators = config_dict["regressor:__choice__"]
        if estimators not in infos:
            infos[estimators] = {}
        infos[estimators][key.config_id] = {
            "metric": {},
            "config": {}
        }
        for metric in self.scoring_functions:
            if val.additional_info is not None and metric.name in val.additional_info:
                infos[estimators][key.config_id]["metric"][metric.name] = get_metric_val(metric, val.additional_info[metric.name])
                infos[estimators][key.config_id]["config"] = self.runhistory.ids_config[key.config_id].get_dictionary()
              
    return infos

  def get_info(self) -> Dict:
    return {
      "id": self.thread.ident,
      "algorithm": self.algorithm,
      "training_time": self.training_time,
      "dataset_name": self.dataset_name,
      "metric": self.metric.name,
      "scoring_functions": [f.name.lower() for f in self.scoring_functions]
    }

  @staticmethod
  def get_classification_metrics():
    return [metric for metric, scorer in CLASSIFICATION_METRICS.items()]

  @staticmethod
  def get_regression_metrics():
    return [metric for metric, scorer in REGRESSION_METRICS.items()]
