import { CalendarOutlined } from '@ant-design/icons'
import { Badge, Card, List } from 'antd'
import React, { useState } from 'react'
import { Text } from '../text'
import UpcomingEventsSkeleton from '../skeleton/upcoming-events'
import { useList } from '@refinedev/core'
import { DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY } from '@/graphql/queries'
import { getDate } from '@/utils/helpers'
import dayjs from 'dayjs'

const UpcomingEvents = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    //useList is a hook provided to manage and fetch lists of data from an API or other data sources.
    const { data, isLoading: eventsLoading } = useList({
        resource: 'events',
        //need to provide graphql meta query for useLIst
        meta: {
            gqlQuery: DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY
        },
        //refine pagination, will take 5 record at a time from gql query
        pagination: {
            pageSize: 5
        },
        sorters: [
            {
                field: 'startDate',
                order: 'asc'
            }
        ],
        filters: [
            {
                field: 'startDate',
                operator: 'gte',
                value: dayjs().format('YYYY-MM-DD') //can use momentjs as well
            }
        ]
    })
    return (
        <Card
            style={{ height: '100%' }}
            headStyle={{ padding: '8px 16px' }}
            bodyStyle={{ padding: '0 1rem' }}
            title={
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                ><CalendarOutlined />
                    <Text
                        size="sm"
                        style={{ marginLeft: '0.7rem' }}
                    >Upcoming Events</Text>

                </div>
            }

        >
            {
                isLoading
                    ?
                    (<List
                        itemLayout='horizontal'
                        dataSource={Array.from({ length: 5 }).map((_, index) => ({
                            id: index,
                        }))}
                        renderItem={() => <UpcomingEventsSkeleton />}
                    />)
                    :
                    (<List
                        itemLayout='horizontal'
                        dataSource={data?.data || []}
                        renderItem={(item) => {

                            const renderDate = getDate(item.startDate, item.endDate)

                            return (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Badge color={item.color} />}
                                        title={<Text size='xs'>{renderDate}</Text>}
                                        description={<Text ellipsis={{ tooltip: true }}
                                            strong
                                        >{item.title}</Text>}
                                    />
                                </List.Item>
                            )
                        }}


                    >
                        {
                            !isLoading
                            &&
                            data?.data.length === 0

                            &&
                            (
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '220px'
                                    }}
                                >No upcoming events!</span>
                            )
                        }

                    </List>)
            }

        </Card>
    )
}

export default UpcomingEvents