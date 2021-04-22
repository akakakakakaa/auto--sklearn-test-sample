from typing import List, Optional, Dict, Union
from ns.autosklearn.autosklearn_wrapper import AutosklearnWrapper
import pandas as pd
import werkzeug
from storage_manager import storage_manager
import os
from io import BytesIO


class AutosklearnWrapperManagerInstance:
  # {
  #   id: AutoSklearnWrapper
  # }
  wrappers_dict = {}
  def __init__(
    self
  ):
    dirs = storage_manager.get_dirs()
    
    for dir in dirs:
      autosklearn_wrapper = AutosklearnWrapper.load(dir)
      if autosklearn_wrapper is not None:
        self.wrappers_dict[autosklearn_wrapper.id] = autosklearn_wrapper


  def create_autosklearn_wrapper(
    self,
    name: str,
    algorithm: str,
    training_time: int,
    memory_limit: int,
    metric: str,
    file: werkzeug.datastructures.FileStorage,
    target_column: str
  ) -> Optional[int]:
    if name in [obj.name for obj in list(self.wrappers_dict.values())]:
      return None
    else:
      storage_manager.save_filestorage(
        file=file,
        relative_path=os.path.join(name, file.filename)
      )
      file.stream.seek(0)
      df = pd.read_csv(BytesIO(file.read()), encoding="utf-8-sig")

      exp_path = os.path.join(storage_manager.root_path, name)
      autosklearn_wrapper = AutosklearnWrapper(
        name=name,
        algorithm=algorithm,
        training_time=training_time,
        memory_limit=memory_limit,
        dataset_name=file.filename,
        metric=metric,
        tmp_folder=os.path.join(exp_path, "tmp"),
        out_folder=os.path.join(exp_path, "out")
      )
      autosklearn_wrapper.fit(
        df=df,
        target_column=target_column
      )

      id = autosklearn_wrapper.thread.ident
      self.wrappers_dict[id] = autosklearn_wrapper

      return id
    

  def delete_autosklearn_wrapper(
    self,
    id: int
  ) -> Optional[int]:
    # TODO: thread can't stop. change thread to process
    if id in list(self.wrappers_dict.keys()):
      storage_manager.delete_dir(self.wrappers_dict[id].name)
      del self.wrappers_dict[id]
      return 1
    else:
      return None


  def get_history(
    self,
    id: int
  ) -> Optional[Dict]:
    if id not in list(self.wrappers_dict.keys()):
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
    if id not in list(self.wrappers_dict.keys()):
      return None
    else:
      autosklearn_info = self.wrappers_dict[id].get_info()
      del autosklearn_info["tmp_folder"]
      del autosklearn_info["out_folder"]
      return autosklearn_info


  def get_runs_with_status(self) -> List[Dict[str, Union[str, int]]]:
    return [{"id": id, "name": val.name, "status": val.status} for id, val in self.wrappers_dict.items()]

class AutosklearnWrapperManager:
  instance = AutosklearnWrapperManagerInstance()


manager = AutosklearnWrapperManager.instance