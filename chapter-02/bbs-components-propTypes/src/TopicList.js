import React, { Component } from "react";
import TopicItem from "./TopicItem";

class TopicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: []
    };
    this.timer = null;
    this.handleVote = this.handleVote.bind(this);
  }

  componentDidMount() {
    const that = this;
    setTimeout(function() {
      that.setState({
        topics: [
          { id: 1, title: "大家一起来讨论React吧", author: "张三", date: "2017-09-01 10:00", vote: 0 },
          { id: 2, title: "前端框架，你最爱哪一个", author: "李四", date: "2017-09-01 12:00", vote: 0 },
          { id: 3, title: "Web App的时代已经到来", author: "王五", date: "2017-09-01 14:00", vote: 0 }
        ]
      });
    }, 1000);
  }

  componentWillUnmount() {
    if(this.timer) {
      clearTimeout(this.timer);
    }
  }

  handleVote(id) {
    const topics = this.state.topics.map(item => {
      const newItem = item.id === id ? {...item, vote: ++item.vote} : item;
      return newItem;
    })
    this.setState({
      topics
    })
  }

  render() {
    return (
      <div>
        话题列表：
        <ul>
          {this.state.topics.map(item =>
            <TopicItem
              topic = {item}
              onVote = {this.handleVote}
            />
          )}
        </ul>
      </div>
    );
  }
}

export default TopicList;
