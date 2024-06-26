import CustomAvatar from '@/components/custom-avatar'
import { Text } from '@/components/text'
import { COMPANIES_LIST_QUERY } from '@/graphql/queries'
import { CompaniesListQuery } from '@/graphql/types'
import { currencyNumber } from '@/utils'
import { SearchOutlined } from '@ant-design/icons'
import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, useTable } from '@refinedev/antd'
import { HttpError, getDefaultFilter, useGo } from '@refinedev/core'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { Input, Space, Table } from 'antd'
import React from 'react'

type Company = GetFieldsFromList<CompaniesListQuery>;
const CompanyListPage = ({ children }: React.PropsWithChildren) => {

    const go = useGo() //to go to different path
    const { tableProps, filters } = useTable<Company, HttpError, Company>({
        resource: 'companies',
        onSearch : (values) => {
            return [
                //applies filter to entire table
                {
                    field:"name",
                    operator: "contains",
                    value: values.name,

                },
            ];
        },
        filters: {
            initial: [
                {
                    field: "name",
                    operator: "contains",
                    value: undefined,
                },
            ],
        },
        sorters: {
            initial: [
                {
                    field: 'createdAt',
                    order: 'desc'
                }
            ]
        },
        pagination: {
            pageSize: 12
        },
        meta: {
            gqlQuery: COMPANIES_LIST_QUERY
        },
    })
    return (
        <div>
            <List
                breadcrumb={false}
                headerButtons={
                    () => (
                        <CreateButton
                            onClick={() => {
                                //This function is used to navigate to a different route within the application. It is typically provided by Refine's router context.
                                go({
                                    to: {
                                        resource: 'companies',
                                        action: 'create' //navigate to creation form for companies resource
                                    },
                                    options: {
                                        keepQuery: true //current query param will be merged with new query params
                                    },
                                    //how navigation will affect browser history stack.
                                    //push adds new entry to history stack
                                    //replace - current entry replaces
                                    //reload - reload current page
                                    type: 'replace' //can be push replace and reload. replace to complete replaces current entry on history stack of browser 
                                })
                            }}
                        />
                    )
                }
            >

                <Table
                    {...tableProps}
                    pagination={{
                        ...tableProps.pagination
                    }}
                >
                    <Table.Column<Company>
                        dataIndex="name"
                        title="Company Title"
                        defaultFilteredValue={getDefaultFilter('id', filters)}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Input placeholder='Search Company' />
                            </FilterDropdown>
                        )}
                        render={(_, record) => {
                            return (
                                <Space>
                                    <CustomAvatar
                                        shape="square"
                                        name={record.name}
                                        src={record.avatarUrl}
                                    />
                                    <Text
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {record.name}
                                    </Text>
                                </Space>
                            );
                        }}
                    />

                    <Table.Column<Company>
                        dataIndex="totalRevenue"
                        title="Open deals amount"
                        render={(_, company) => {
                            return (
                                <Text>
                                    {currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0)}
                                </Text>
                            );
                        }}
                    />
                    <Table.Column<Company>
                        dataIndex="id"
                        title="Actions"
                        fixed='right'

                        render={(value) => {
                            return (
                                <Space>
                                    <EditButton hideText size="small" recordItemId={value} />
                                    <DeleteButton hideText size="small" recordItemId={value} />
                                </Space>
                            )
                        }}
                    />
                </Table>
            </List>
            {children}
        </div>
    )
}

export default CompanyListPage