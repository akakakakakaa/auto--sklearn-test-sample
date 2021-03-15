from flask import Flask, request
from flask_cors import CORS
import sklearn.datasets
import sklearn.metrics
import autosklearn.classification
import threading
import time
from smac.runhistory.runhistory import RunHistory
from autosklearn.metrics import balanced_accuracy, precision, recall, f1, accuracy

app = Flask(__name__)
CORS(app)
autosklearn_history = {}
scoring_functions=[balanced_accuracy, accuracy, precision, f1]

@app.route("/autosklearntest", methods=["GET","POST"])
def handle_autosklearntest_request():
  if request.method == "POST":
    tmp_runhistory = RunHistory()

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
                runhistory=tmp_runhistory,
                run_id=seed,
                intensifier=SuccessiveHalving,
                intensifier_kwargs={
                    'initial_budget': 10.0,
                    'max_budget': 100,
                    'eta': 2,
                    'min_chall': 1},
                n_jobs=n_jobs,
                dask_client=dask_client,
            )
        return get_smac_object

    automl = autosklearn.classification.AutoSklearnClassifier(
        time_left_for_this_task=120,
        per_run_time_limit=30,
        metric=autosklearn.metrics.accuracy,
        scoring_functions=scoring_functions,
        tmp_folder='/tmp/autosklearn_classification_example_tmp15',
        output_folder='/tmp/autosklearn_classification_example_out15',
        get_smac_object_callback=get_smac_object_callback("iterations")
    )

    def run_automl():
      X, y = sklearn.datasets.load_breast_cancer(return_X_y=True)
      X_train, X_test, y_train, y_test = \
          sklearn.model_selection.train_test_split(X, y, random_state=1)
      automl.fit(X_train, y_train, dataset_name='breast_cancer')

    t = threading.Thread(target=run_automl)
    t.start()
    autosklearn_history[t.ident] = {
      "thread": t,
      "history": tmp_runhistory
    }
    return {"thread_id": t.ident}

  elif request.method == "GET":
    thread_id = request.args.get("thread_id", type=int)
    def get_metric_val(metric, cost):
        return metric._optimum - (metric._sign * cost)

    history = autosklearn_history[thread_id]["history"]
    infos = {}
    for key, val in history.data.items():
        config_dict = history.ids_config[key.config_id].get_dictionary()
        classifier = config_dict["classifier:__choice__"]
        if classifier not in infos:
            infos[classifier] = {}
        infos[classifier][key.config_id] = {
            "metrics": {},
            "configs": {}
        }
        for metric in scoring_functions:
            if val.additional_info is not None and metric.name in val.additional_info:
                infos[classifier][key.config_id]["metrics"][metric.name] = get_metric_val(metric, val.additional_info[metric.name])
        # infos[key.config_id]["configs"] = history.ids_config[key.config_id].get_dictionary()
    return infos


if __name__ == "__main__":
  app.run(host="0.0.0.0", port="5500")