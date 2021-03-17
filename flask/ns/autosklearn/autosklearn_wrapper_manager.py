from typing import List, Optional, Dict, Union
from ns.autosklearn.autosklearn_wrapper import AutosklearnWrapper
import pandas as pd


class AutosklearnWrapperManagerInstance:
  # {
  #   id: { 
  #    "name": ~~,
  #    "obj": AutoSklearnWrapper
  #   }
  # }
  wrappers_dict = {}

  def create_autosklearn_wrapper(
    self,
    name: str,
    algorithm: str,
    training_time: int,
    memory_limit: int,
    dataset_name: str,
    metric: str,
    df: pd.DataFrame,
    target_column: str
  ) -> Optional[int]:
    if name in [val["name"] for key, val in self.wrappers_dict.items()]:
      return None
    else:
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

      self.wrappers_dict[autosklearn_wrapper.thread.ident] = {
        "name": name,
        "obj": autosklearn_wrapper
      }
      return autosklearn_wrapper.thread.ident
    

  def get_history(
    self,
    id: int
  ) -> Optional[Dict]:
    if id not in list(self.wrappers_dict.keys()):
      return None
    else:
      history = self.wrappers_dict[id]["obj"].get_history()
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
    if id not in list(self.wrappers_dict.keys()):
      return None
    else:
      autosklearn_info = self.wrappers_dict[id]["obj"].get_info()
      autosklearn_info["name"] = self.wrappers_dict[id]["name"]
      return autosklearn_info

  def get_runs_with_status(self) -> List[Dict[str, Union[str, int]]]:
    return [{"id": id, "name": val["name"], "status": val["obj"].status } for id, val in self.wrappers_dict.items()]


class AutosklearnWrapperManager:
  instance = AutosklearnWrapperManagerInstance()


manager = AutosklearnWrapperManager.instance