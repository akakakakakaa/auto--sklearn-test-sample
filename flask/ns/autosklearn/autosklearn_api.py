from flask_restx import Namespace, Resource, fields, reqparse
from werkzeug.datastructures import FileStorage
from ns.autosklearn.autosklearn_wrapper_manager import manager
from ns.autosklearn.autosklearn_wrapper import AutosklearnWrapper
import pandas as pd
from io import BytesIO

#
ns = Namespace("autosklearn", description="autosklearn operations")

#
autosklearn_classification_parser = reqparse.RequestParser(bundle_errors=True)
autosklearn_classification_parser.add_argument("name", type=str, required=True)
autosklearn_classification_parser.add_argument("training_time", type=int, required=True)
autosklearn_classification_parser.add_argument("memory_limit", type=int, required=True)
autosklearn_classification_parser.add_argument(
  "metric",
  choices=tuple(AutosklearnWrapper.get_classification_metrics()),
  type=str,
  required=True
)
autosklearn_classification_parser.add_argument("target_column", type=str, required=True)
autosklearn_classification_parser.add_argument("file", location="files", type=FileStorage, required=True)

#
autosklearn_regression_parser = reqparse.RequestParser(bundle_errors=True)
autosklearn_regression_parser.add_argument("name", type=str, required=True)
autosklearn_regression_parser.add_argument("training_time", type=int, required=True)
autosklearn_regression_parser.add_argument("memory_limit", type=int, required=True)
autosklearn_regression_parser.add_argument(
  "metric",
  choices=tuple(AutosklearnWrapper.get_regression_metrics()),
  type=str,
  required=True
)
autosklearn_regression_parser.add_argument("target_column", type=str, required=True)
autosklearn_regression_parser.add_argument("file", location="files", type=FileStorage, required=True)

#
history_model = ns.model("autosklearn_history", {
  "estimator": fields.List(
    fields.Nested(ns.model("estimator", {
      "name": fields.String,
      "history": fields.List(
        fields.Nested(ns.model("estimator_history", {
          "id": fields.Integer,
          "metric": fields.List(
            fields.Nested(ns.model("metric", {
              "name": fields.String,
              "val": fields.Float
            }))
          ),
          "config": fields.List(
            fields.Nested(ns.model("config", {
              "name": fields.String,
              "val": fields.Raw 
            }))
          ),
        }))
      )
    }))
  )
})

#
info_model = ns.model("autosklearn_info", {
  "id": fields.Integer,
  "name": fields.String,
  "algorithm": fields.String,
  "training_time": fields.Integer,
  "metric": fields.String,
  "scoring_functions": fields.List(fields.String)
})

#
metric_model = ns.model("autosklearn_support_metrics", {
  "metrics": fields.List(fields.String)
})

#
runs_model = ns.model("autosklearn_runs", {
  "runs": fields.List(
    fields.Nested(
      ns.model("autosklearn_run_info", {
        "id": fields.Integer,
        "name": fields.String,
        "status": fields.String
      })
    )
  )
})



@ns.route("/classification")
class AutosklearnClassifier(Resource):
  @ns.doc(body=autosklearn_classification_parser)
  @ns.expect(autosklearn_classification_parser)
  @ns.response(200, "Success", info_model)
  @ns.response(409, "Name already exists")
  def post(self):
    args = autosklearn_classification_parser.parse_args()

    data = args["file"].read()
    csv_frame = pd.read_csv(BytesIO(data), encoding="utf-8-sig")

    id = manager.create_autosklearn_wrapper(
        name=args["name"],
        algorithm="classification",
        training_time=args["training_time"],
        memory_limit=args["memory_limit"],
        dataset_name=args["file"].filename,
        metric=args["metric"],
        df=csv_frame,
        target_column=args["target_column"]
    )

    if id is None:
      ns.abort(409)
    else:
      return manager.get_info(id)


@ns.route("/classification/metrics")
class AutosklearnClassifierMetrics(Resource):
  @ns.response(200, "Success", metric_model)
  def get(self):
    return {"metrics": AutosklearnWrapper.get_classification_metrics()}


@ns.route("/regression")
class AutosklearnClassifier(Resource):
  @ns.doc(body=autosklearn_regression_parser)
  @ns.expect(autosklearn_regression_parser)
  @ns.response(200, "Success", info_model)
  @ns.response(409, "Name already exists")
  def post(self):
    args = autosklearn_regression_parser.parse_args()

    data = args["file"].read()
    csv_frame = pd.read_csv(BytesIO(data), encoding="utf-8-sig")

    id = manager.create_autosklearn_wrapper(
        name=args["name"],
        algorithm="regression",
        training_time=args["training_time"],
        memory_limit=args["memory_limit"],
        dataset_name=args["file"].filename,
        metric=args["metric"],
        df=args["csv_frame"],
        target_column=args["target_column"]
    )

    if id is None:
      ns.abort(409)
    else:
      return manager.get_info(id)


@ns.route("/regression/metrics")
class AutosklearnRegressorMetrics(Resource):
  @ns.response(200, "Success", metric_model)
  def get(self):
    return {"metrics": AutosklearnWrapper.get_regression_metrics()}


@ns.route("/<int:id>/history")
@ns.param("id", "autosklearn id")
class AutosklearnHistory(Resource):
  @ns.response(200, "Success", history_model)
  @ns.response(404, "Id Not exists")
  def get(self, id):
    history = manager.get_history(id)

    if history is None:
      ns.abort(404)
    else:
      return history


@ns.route("/<int:id>/info")
@ns.param("id", "autosklearn id")
class AutosklearnInfo(Resource):
  @ns.response(200, "Success", info_model)
  @ns.response(404, "Id Not exists")
  def get(self, id):
    info = manager.get_info(id)

    if info is None:
      ns.abort(404)
    else:
      return info


@ns.route("/")
class AutosklearnList(Resource):
  @ns.response(200, "Success", runs_model)
  def get(self):
    runs = manager.get_runs_with_status()
    return {"runs": runs}
