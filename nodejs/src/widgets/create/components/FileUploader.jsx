import React, { Component } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import "./FileUploader.scss";
import { Typography } from "@material-ui/core";

class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
    };
  }
  handleChange(files) {
    this.setState({
      file: files[0],
    });
    this.props.setCSV(files[0]);
  }
  render() {
    return (
      <div>
        <DropzoneArea
          acceptedFiles={[
            ".csv, text/csv",
            "application/vnd.ms-excel",
            "application/csv",
            "text/x-csv",
            "application/x-csv",
            "text/comma-separated-values",
            "text/x-comma-separated-values",
          ]}
          filesLimit={1}
          onChange={this.handleChange.bind(this)}
          showPreviewsInDropzone={false}
          dropzoneText={`클릭 하시거나 파일을 끌어서 놓아주세요.`}
          getFileAddedMessage={(fileName) =>
            `${fileName} 파일이 성공적으로 업로드 되었습니다.`
          }
          getDropRejectMessage={(file) =>
            `.${file.name.split(".")[1]}은 지원되지 않는 확장자 입니다.`
          }
        />
        {this.state.file && (
          <Typography
            style={{ paddingTop: "1rem", paddingLeft: "1rem" }}
            variant="body2"
          >
            {`파일: ${this.state.file.name}`}
          </Typography>
        )}
      </div>
    );
  }
}

export default FileUploader;
