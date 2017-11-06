import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import TopicEditor from "./components/TopicEditor";
import TopicViewer from "./components/TopicViewer";
import RemarkList from "./components/RemarkList";
import { getLoggedUser } from "../../redux/modules/auth";
import { actions as topicActions, getTopicById } from "../../redux/modules/topics";
import { actions as remarkActions, getRemarksByTopic } from "../../redux/modules/remarks";
import { actions as uiActions, isEditDialogOpen } from "../../redux/modules/ui";
import "./style.css";

class Topic extends Component {

  componentDidMount() {
    const topicId = this.props.match.params.id;
    this.props.fetchTopic(topicId);
    this.props.fetchRemarks(topicId);
  }

  handleEditClick = () => {
    this.props.openEditDialog();
  }

  handleTopicSave = (data) => {
    const id = this.props.match.params.id;
    this.props.updateTopic(id, data);
  }

  handleTopicCancel = () => {
    this.props.closeEditDialog();
  }

  handleRemarkSubmit = (content) => {
    const topicId = this.props.match.params.id;
    const { user } = this.props;
    const remark = {
      author: user.userId,
      topic: topicId,
      content: content
    };
    this.props.createRemark(remark);
  }

  render() {
    const { topic, remarks, user, isEditDialogOpen } = this.props;
    if (!topic) {
      return null;
    }
    const editable = user.userId === topic.author.id;
    return (
      <div className="topic">
        {isEditDialogOpen ? (
          <TopicEditor
            topic={topic}
            onSave={this.handleTopicSave}
            onCancel={this.handleTopicCancel}
          />
        ) : (
          <TopicViewer
            topic={topic}
            editable={editable}
            onEditClick={this.handleEditClick}
          />
        )}
        <RemarkList
          remarks={remarks}
          editable={Boolean(user.userId)}
          onSubmit={this.handleRemarkSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: getLoggedUser(state),
    topic: getTopicById(state, props.match.params.id),
    remarks: getRemarksByTopic(state, props.match.params.id),
    isEditDialogOpen: isEditDialogOpen(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(topicActions, dispatch),
    ...bindActionCreators(remarkActions, dispatch),
    ...bindActionCreators(uiActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
