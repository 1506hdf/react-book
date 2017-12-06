import React, { Component } from "react";
import { Link } from "react-router-dom";
import PostsView from "./PostsView";
import PostEditor from "./PostEditor";
import { get, post } from "../utils/request";
import url from "../utils/url";
import "./PostList.css";

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      newPost: false
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);
    this.refreshPostList = this.refreshPostList.bind(this);
  }

  componentDidMount() {
    this.refreshPostList();
  }
  
  // 获取帖子列表
  refreshPostList() {
    get(url.getPostList()).then(data => {
      if (!data.error) {
        this.setState({
          posts: data,
          newPost: false
        });
      }
    });
  }
  
  // 保存帖子
  handleSave(data) {
    const post = { ...data, author: this.props.userId, vote: 0 };
    post(url.createPost(), post).then(data => {
      if (!data.error) {
        this.refreshPostList();
      }
    });
  }
  
  // 取消新建帖子
  handleCancel() {
    this.setState({
      newPost: false
    });
  }
  
  // 新建帖子
  handleNewPost() {
    this.setState({
      newPost: true
    });
  }

  render() {
    const { userId } = this.props;
    return (
      <div className="postList">
        <div>
          <h2>帖子列表</h2>
          {userId ? <button onClick={this.handleNewPost}>发帖</button> : null}
        </div>
        {this.state.newPost ? (
          <PostEditor onSave={this.handleSave} onCancel={this.handleCancel} />
        ) : null}
        <PostsView posts={this.state.posts} />
      </div>
    );
  }
}

export default PostList;
