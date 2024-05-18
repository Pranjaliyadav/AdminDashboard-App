import KanbanItem from '@/components/tasks/item'
import { KanbanBoardContainer, KanbanBoard } from '@/components/tasks/kanban/board'
import KanbanColumn from '@/components/tasks/kanban/column'
import React from 'react'

const TasksList = () => {
    return (
        <>
            <KanbanBoardContainer>
                <KanbanBoard>
                    <KanbanColumn>
                        <KanbanItem >This is my first to do</KanbanItem>

                    </KanbanColumn>
                    <KanbanColumn></KanbanColumn>
                </KanbanBoard>

            </KanbanBoardContainer>
        </>
    )
}

export default TasksList
