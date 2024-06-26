import { KanbanColumnSkeleton, ProjectCardSkeleton } from '@/components'
import KanbanItem from '@/components/tasks/item'
import { KanbanAddCardButton } from '@/components/tasks/kanban/add-card-button'
import { KanbanBoardContainer, KanbanBoard } from '@/components/tasks/kanban/board'
import ProjectCard, { ProjectCardMemo } from '@/components/tasks/kanban/card'
import KanbanColumn from '@/components/tasks/kanban/column'
import { UPDATE_TASK_STAGE_MUTATION } from '@/graphql/mutation'
import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries'
import { TaskStagesQuery, TasksQuery } from '@/graphql/types'
import { DragEndEvent } from '@dnd-kit/core'
import { useList, useNavigation, useUpdate } from '@refinedev/core'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { group } from 'console'
import React from 'react'

type Task = GetFieldsFromList<TasksQuery>;
type TaskStage = GetFieldsFromList<TaskStagesQuery> & { tasks: Task[] };

const TasksList = ({ children }: React.PropsWithChildren) => {

    const {replace} = useNavigation()

    //fetching diff stages like todo, in progress, etc
    const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
        resource: 'taskStages',
        meta: {
            gqlQuery: TASK_STAGES_QUERY
        },
        filters: [
            {
                field: 'title',
                operator: 'in',
                value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE']
            }
        ],
        sorters: [
            {
                field: 'createdAt',
                order: 'asc'
            }
        ]
    })

    //fetching all tasks, that will be grouped based on stages
    const { data: tasks, isLoading: isLoadingTasks } = useList<GetFieldsFromList<TasksQuery>>({
        resource: 'tasks',

        meta: {
            gqlQuery: TASKS_QUERY
        },
        sorters: [
            {
                field: 'dueDate',
                order: 'asc'
            }
        ],
        pagination: {
            mode: 'off'
        },
        queryOptions: {
            //only fetch tasks if stages are there and they exists
            enabled: !!stages //!! turn this into a boolean variable,
        }


    })

    const { mutate: updateTask } = useUpdate()

    //memoise tasks, only render again if stage sor tasks change.
    const taskByStages = React.useMemo(() => {
        if (!stages?.data || !tasks?.data) {
            return {
                unassignedStage: [],
                stages: []
            }
        }

        const unassignedStage = tasks?.data.filter((task) => task.stageId === null)

        // prepare unassigned stage
        const grouped: TaskStage[] = stages.data.map((stage) => ({
            ...stage,
            tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
        }));
        return {
            unassignedStage,
            columns: grouped
        }

    }, [stages, tasks])

    const handleAddCard = (args: { stageId: string }) => {
        const path = args.stageId === 'unassigned'
        ?
        '/tasks/new'
        :
        `/tasks/new?stageId=${args.stageId}`

        replace(path)
    }

    const handleOnDragEnd = (event: DragEndEvent) => {
        let stageId = event.over?.id as undefined | string | null
        const taskId = event.active.id as string
        const taskStageId = event.active.data.current?.stageId

        if (taskStageId === stageId) return
        if (stageId === 'unassigned') {
            stageId = null
        }

        updateTask({
            resource : 'tasks',
            id : taskId,
            values : {
                stageId : stageId,
            },
            successNotification : false,
            mutationMode : 'optimistic',
            meta : {
                gqlMutation : UPDATE_TASK_STAGE_MUTATION
            }
        })

    }

    const isLoading = isLoadingStages || isLoadingTasks

    if (isLoading) return <PageSkeleton />

    return (
        <>
            <KanbanBoardContainer>
                <KanbanBoard  
                onDragEnd = {handleOnDragEnd}
                >
                    <KanbanColumn
                        id="unassigned"
                        title={"unassigned"}
                        count={taskByStages.unassignedStage.length || 0}
                        onAddClick={() => handleAddCard({ stageId: 'unassigned' })}
                    >
                        {taskByStages.unassignedStage.map((task) => (
                            <KanbanItem key={task.id} id={task.id}
                                data={{ ...task, stageId: 'unassigned' }}
                            >
                                <ProjectCardMemo
                                    {...task}
                                    dueDate={task.dueDate || undefined}
                                />
                            </KanbanItem>
                        ))}

                        {!taskByStages.unassignedStage.length &&
                            <KanbanAddCardButton
                                onClick={() => handleAddCard({ stageId: 'unassigned' })}
                            />

                        }

                    </KanbanColumn>

                    {taskByStages.columns?.map((column) =>
                    (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            count={column.tasks.length}
                            onAddClick={() => handleAddCard({ stageId: column.id })}
                        >
                            {!isLoading && column.tasks.map((task) => (
                                <KanbanItem
                                    key={task.id}
                                    id={task.id}
                                    data={task}
                                >
                                    <ProjectCardMemo
                                        {...task}
                                        dueDate={task.dueDate || undefined}
                                    />

                                </KanbanItem>
                            ))}
                            {!column.tasks.length &&
                                (
                                    <KanbanAddCardButton
                                        onClick={() => handleAddCard({ stageId: column.id })}
                                    />
                                )}
                        </KanbanColumn>
                    ))}
                </KanbanBoard>

            </KanbanBoardContainer>
            {children}
        </>
    )
}

export default TasksList

const PageSkeleton = () => {
    const columnCount = 6
    const itemCount = 4

    return (
        <KanbanBoardContainer>
            {Array.from({ length: columnCount }).map((_, index) => (
                <KanbanColumnSkeleton key={index}>
                    {Array.from({ length: itemCount }).map((_, index) => (
                        <ProjectCardSkeleton key={index} />
                    ))}
                </KanbanColumnSkeleton>
            ))}
        </KanbanBoardContainer>
    )
}