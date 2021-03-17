from typing import List, Optional, Dict
from ns.autosklearn.autosklearn_wrapper import AutosklearnWrapper
import pandas as pd


class AutosklearnWrapperManagerInstance:
  # {"id": AutoSklearnWrapper}
  wrappers_dict = {
  }

  def create_autosklearn_wrapper(
    self,
    algorithm: str,
    training_time: int,
    memory_limit: int,
    dataset_name: str,
    metric: str,
    df: pd.DataFrame,
    target_column: str
  ) -> int:
    autosklearn_wrapper = AutosklearnWrapper(
        algorithm=algorithm,
        training_time=training_time,
        memory_limit=memory_limit,
        dataset_name=dataset_name,
        metric=metric
    )
    autosklearn_wrapper.fit(
        df=df,
        target_column=target_column
    )

    self.wrappers_dict[autosklearn_wrapper.thread.ident] = autosklearn_wrapper
    return autosklearn_wrapper.thread.ident
    

  def get_history(
    self,
    id: int
  ) -> Optional[Dict]:
    if id not in self.wrappers_dict:
      return None
    else:
      history = self.wrappers_dict[id].get_history()
      new_history = {
        "estimator": []
      }

      for estimator, infos in history.items():
        new_history["estimator"].append({
          "name": estimator,
          "history": [{
            "id": config_id,
            "metric": [{"name": name, "val": val} for name, val in info["metric"].items()],
            "config": [{"name": name, "val": val} for name, val in info["config"].items()]
          } for config_id, info in infos.items()]
        })

      return new_history

  def get_info(
    self,
    id: int
  ) -> Optional[Dict]:
    if id not in self.wrappers_dict:
      return None
    else:
      return self.wrappers_dict[id].get_info()

  def get_list_with_status() -> Dict[int, Dict]:
    return {key: {"status": self.wrapper_dict[key].status } for key in self.wrappers_dict.keys()}


class AutosklearnWrapperManager:
  instance = AutosklearnWrapperManagerInstance()


manager = AutosklearnWrapperManager.instance