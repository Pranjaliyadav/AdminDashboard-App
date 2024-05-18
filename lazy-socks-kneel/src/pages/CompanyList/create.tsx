import React from 'react'
import CompanyListPage from './list'
import Modal from 'antd/es/modal/Modal'
import { useModalForm, useSelect } from '@refinedev/antd'
import { useGo } from '@refinedev/core'
import { CREATE_COMPANY_MUTATION } from '@/graphql/mutation'
import { Form, Input, Select } from 'antd'
import { USERS_SELECT_QUERY } from '@/graphql/queries'
import SelectOptionWithAvatar from '@/components/select-option-with-avatar'
import { UsersSelectQuery } from '@/graphql/types'
import { GetFieldsFromList } from '@refinedev/nestjs-query'

const CreateTask = () => {

    const go = useGo()



    const goToListPage = () => {
        go({
            to: {
                resource: 'companies',
                action: 'list'

            },
            options: {
                keepQuery: true
            },
            type: 'replace'
        })
    }

    const { formProps, modalProps } = useModalForm({
        action: 'create',
        defaultVisible: true,
        resource: 'companies',
        redirect: false,
        //optimistic, pessimistic, undoable
        mutationMode: 'pessimistic', //redirection and uodation is done after mutation is fully successful
        onMutationSuccess: goToListPage,
        meta: {
            gqlMutation: CREATE_COMPANY_MUTATION
        }
    })


    const { selectProps, queryResult } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
        resource: 'users',
        optionLabel: 'name',
        meta: {
            gqlQuery: USERS_SELECT_QUERY
        }
    })

    return (
        <CompanyListPage>

            <Modal
                {...modalProps}
                mask={true}
                onCancel={goToListPage}
                title="Create Company"
                width={512}
            >

                <Form
                    {...formProps}
                    layout="vertical"
                >
                    <Form.Item
                        label="Company name"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Please enter a company name' />
                    </Form.Item>
                    <Form.Item
                        label="Sales owner"
                        name="salesOwnerId"
                        rules={[{ required: true }]}

                    >
                        <Select
                            placeholder="Please select a sales owner"
                            {...selectProps}
                            options = {
                                queryResult.data?.data.map((user)=>({
                                    value  :user.id,
                                    label : (
                                        <SelectOptionWithAvatar
                                        name={user.name}
                                        avatarUrl={user.avatarUrl ?? undefined}
                                        />
                                    )

                                })) ?? []
                            }
                        />
                    </Form.Item>
                </Form>

            </Modal>
        </CompanyListPage>
    )
}

export default CreateTask
