import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import React, { Children } from 'react'

type Props = {
    onDragEnd: (event: DragEndEvent) => void
}

export const KanbanBoardContainer = ({ children }: React.PropsWithChildren) => {
    return (
        <div
            style={{
                width: 'calc(100% + 64px',
                height: 'calc(100vh - 64px',
                display: 'flex',
                justifyContent: 'column',
                margin: '-32px'

            }}
        >
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                padding: '32px',
                overflow: 'scroll'

            }} >{children}</div>
        </div>
    )
}

export const KanbanBoard = ({ children, onDragEnd }: React.PropsWithChildren<Props>) => {

    const mouseSensor = useSensor(MouseSensor,{
        activationConstraint : { //confition under which a draggable element becomes active, when are we actually dragging
            distance : 5, //minimum amnt to drag to get considered active . 5 px
        }
    })

    //for mobile
    const touchSensor = useSensor(TouchSensor,{
        activationConstraint: { //confition under which a draggable element becomes active, when are we actually dragging
            distance: 5, //minimum amnt to drag to get considered active
        }
    })

    const sensors = useSensors(mouseSensor, touchSensor)

    return (
        <DndContext onDragEnd={onDragEnd} sensors={sensors} > {/* manages entire drag and drop process */}
            {children}
        </DndContext>
    )
}
