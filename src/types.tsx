export interface infTodolist {
    dueDate: Date | null,
    description: string,
    checked: boolean,
    deleteUndo: boolean
}

export interface infValidate {
    validateCreateDate: boolean | null,
    validateDescription: boolean | null
}