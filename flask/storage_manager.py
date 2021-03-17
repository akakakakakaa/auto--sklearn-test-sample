from config import STORAGE_MODE, STORAGE_LOCAL_PATH
import werkzeug
import os
from abc import *
import json
from typing import Dict


class StorageManager(ABC):
  @abstractmethod
  def save_filestorage(
    self,
    file: werkzeug.datastructures.FileStorage
  ):
    pass


class LocalStorageManager(StorageManager):
  def __init__(
    self,
    path: str = STORAGE_LOCAL_PATH
  ):
    os.makedirs(path, exist_ok=True)
    self.root_path = path


  def save_filestorage(
    self,
    file: werkzeug.datastructures.FileStorage,
    relative_path: str
  ) -> None:
    os.makedirs(os.path.dirname(os.path.join(self.root_path, relative_path)), exist_ok=True)
    file.save(os.path.join(self.root_path, relative_path))


  def save_json(
    self,
    data: Dict,
    relative_path: str
  ) -> None:
    os.makedirs(os.path.dirname(os.path.join(self.root_path, relative_path)), exist_ok=True)
    with open(os.path.join(self.root_path, relative_path), 'w') as f:
      json.dump(data, f)


  def load_json(
    self,
    relative_path: str
  ) -> Dict:
    with open(os.path.join(self.root_path, relative_path), 'r') as f:
      return json.load(f)


  def get_dirs(self):
    return os.listdir(self.root_path)

  def file_exists(self, relative_path: str):
    return os.path.exists(os.path.join(self.root_path, relative_path))

  def get_abspath(self, relative_path: str) -> str:
    return os.path.join(self.root_path, relative_path)


class StorageManagerInstance:
  instance = None

  def __init__(self):
    if STORAGE_MODE == "local":
      self.instance = LocalStorageManager()

storage_manager = StorageManagerInstance().instance