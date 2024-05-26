import React, { useState, ChangeEvent, useEffect } from "react";
import { DatePicker, Input, Card, Col, Row, Button, Spin } from "antd";
import { infTodolist, infValidate } from "./types";
import {
  FieldTimeOutlined,
  PlusOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const App: React.FC = () => {
  const [createDate, setCreateDate] = useState<Date | null>(null);
  const [todoList, setTodoList] = useState<infTodolist[]>([]);
  const [description, setDescription] = useState<string>("");
  const [validate, setValidate] = useState<infValidate>({
    validateCreateDate: null,
    validateDescription: null,
  });
  const handleTaskCheck = (index: number) => {
    const newTodoList = [...todoList];
    newTodoList[index].checked = !newTodoList[index].checked;
    setTodoList(newTodoList);
    localStorage.setItem("todoList", JSON.stringify(newTodoList));
  };
  const [lastDeletedItem, setLastDeletedItem] = useState<infTodolist | null>(
    null
  );
  const [undoTimeout, setUndoTimeout] = useState<
    NodeJS.Timeout | number | undefined
  >(undefined);

  const formateDate = (date: Date | null) => {
    if (date !== null) {
      date = new Date(date);
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${month} ${day}, ${year}`;
      return formattedDate;
    } else {
      return "";
    }
  };

  const handleCreateNewTask = () => {

    if (createDate !== null) {
      setValidate((prev) => ({
        ...prev,
        validateCreateDate: true,
      }));
    } else {
      setValidate((prev) => ({
        ...prev,
        validateCreateDate: false,
      }));
      return;
    }

    if (description !== null && description !== "") {
      setValidate((prev) => ({
        ...prev,
        validateDescription: true,
      }));
    } else {
      setValidate((prev) => ({
        ...prev,
        validateDescription: false,
      }));
      return;
    }

    const newTodoList = [
      ...todoList,
      {
        dueDate: createDate,
        description: description,
        checked: false,
        deleteUndo: false,
      },
    ];
    setTodoList(newTodoList);
    localStorage.setItem("todoList", JSON.stringify(newTodoList));
  };

  const handleCreateDateChange = (date: Date) => {
    setCreateDate(new Date(date));
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleDeleteTask = (index: number) => {
    if (!lastDeletedItem) {
      const newTodoList = [...todoList];
      newTodoList[index].deleteUndo = !newTodoList[index].deleteUndo;
      setTodoList(newTodoList);
      const deletedItem = todoList[index];
      setLastDeletedItem(deletedItem);
      clearTimeout(undoTimeout);
      const timeout = setTimeout(() => {
        setLastDeletedItem(null);
        const newTodoList = todoList.filter((_, idx) => idx !== index);
        setTodoList(newTodoList);
        localStorage.setItem("todoList", JSON.stringify(newTodoList));
      }, 15000);
      setUndoTimeout(timeout);
    }
  };

  const handleUndoDelete = (index: number) => {
    if (lastDeletedItem) {
      const newTodoList = [...todoList];
      newTodoList[index].deleteUndo = !newTodoList[index].deleteUndo;
      setTodoList(newTodoList);
      setLastDeletedItem(null);
      clearTimeout(undoTimeout);
    }
  };

  useEffect(() => {
    const savedTodoList = localStorage.getItem("todoList");
    if (savedTodoList !== null) {
      setTodoList(JSON.parse(savedTodoList));
    }
  }, []);

  return (
    <>
      <div className="w-full flex justify-center mt-10">
        <div className="container">
          <Row gutter={20}>
            <Col span={24}>
              <Card type="inner" title="Create New Task" bordered={false}>
                <div className="grid grid-cols-1 gap-2 mx-5 sm:mx-0">
                  <div className="space-y-2">
                    <h1>Due Date</h1>
                    <DatePicker
                      className="w-full"
                      onChange={handleCreateDateChange}
                      allowClear={false}
                    />
                  </div>
                  {validate.validateCreateDate === false ? (
                    <span className="text-sm text-red-500 italic">
                      * reqiure
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <div className="space-y-2">
                    <h1>Description</h1>
                    <TextArea
                      rows={4}
                      onChange={handleDescriptionChange}
                      placeholder="Description"
                    />
                  </div>
                  {validate.validateDescription === false ? (
                    <span className="text-sm text-red-500 italic">
                      * reqiure
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <div>
                    <Button
                      aria-label="Create"
                      type="primary"
                      icon={<PlusOutlined />}
                      size="middle"
                      onClick={handleCreateNewTask}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <div className="mt-5 mx-5 sm:mx-0">
            <Row gutter={20}>
              <Col span={24}>
                <Card type="inner" title="To-Do List" bordered={false}>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:mx-0">
                    {todoList.length !== 0 ? (
                      todoList.map((item, index) => (
                        <div key={index}>
                          <Row gutter={20}>
                            <Col span={24}>
                              <Card>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <p>{item.description}</p>
                                  </div>
                                  <div className="flex justify-between">
                                    <Button
                                      danger={
                                        item.dueDate
                                          ? new Date(item.dueDate).getDate() <
                                              new Date().getDate() &&
                                            !item.checked
                                          : false
                                      }
                                      type={
                                        item.checked ? "primary" : "default"
                                      }
                                      icon={<FieldTimeOutlined />}
                                      size="small"
                                      onClick={() => {
                                        handleTaskCheck(index);
                                      }}
                                    >
                                      <span>{formateDate(item.dueDate)}</span>
                                    </Button>
                                    {!item.deleteUndo ? (
                                      <Button
                                        id="Cancel"
                                        aria-label="Cancel"
                                        type="text"
                                        icon={<CloseOutlined />}
                                        size="small"
                                        onClick={() => {
                                          handleDeleteTask(index);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    ) : (
                                      <Button
                                        type="text"
                                        aria-label="Undo"
                                        icon={
                                          <Spin
                                            indicator={
                                              <LoadingOutlined
                                                style={{ fontSize: 16 }}
                                                spin
                                              />
                                            }
                                          />
                                        }
                                        size="small"
                                        onClick={() => {
                                          handleUndoDelete(index);
                                        }}
                                      >
                                        Undo
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center col-span-1 text-sm text-gray-400 italic sm:col-span-3">
                        No data
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
