import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    // define properties to be used
    this.state = {
      // empty list to hold data fetched from API
      todoList : [],
      // set to false to show items not marked as complete in UI
      viewCompleted: false,
      modal: false,
      // todo item with it's features
      activeItem: {
        title: "",
        description: "",
        due_date: "",
        completed: false,
      },
      editing: false,
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = () => {
    axios
      .get("http://localhost:8000/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  // changes Modal state when triggered
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  //Responsible for saving the task
  handleSubmit = (item) => {
    // change modal state
    this.toggle();
    //  if item already exists, update it
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}/`, item)
        .then((res) => this.fetchTasks());
      return;
    }
    // else create new item
    axios
      .post("http://localhost:8000/api/todos/", item)
      .then((res) => this.fetchTasks());
  };

  deleteTask = (item) => {
    axios.delete(`http://localhost:8000/api/todos/${item.id}/`).then((res) => this.fetchTasks());
  };


  editTask = (item) => {
    this.setState({
      activeItem: item,
      editing: true,
      modal: !this.state.modal,
    });
  };

  // create item and toggle modal
  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  // tabs to diplay completed or incomplete tasks
  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <button
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </button>
        <button
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </button>
      </div>
    );
  };
  // function that uses built in filter to show completed items from todoList
  renderItems = () => {
    const { viewCompleted } = this.state;
    // a new list to store items to be displayed after filtering
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );
    // display items in newItems list
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between
        align-items-center"
      >
        <span
          // render class based on if the todo is completed or not
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          {item.due_date}
          <div style={{ flex: 2 }}>
            <button
              onClick={() => this.editTask(item)}
              className="btn btn-secondary mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => this.deleteTask(item)}
              className="btn btn-danger"
            >
              Del
            </button>
          </div>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="content">
        <h1 className="text-black text-uppercase text-center my-4">Todo App</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-success">
                  Add Task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;
