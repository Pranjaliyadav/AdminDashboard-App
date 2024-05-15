import { DashboardOutlined, ProjectOutlined, ShopOutlined } from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";

//resource is from refine, that can perform actions such as list sho edit create delete and clone. provide path of page
//like grouping crud operations under single name
export const resources: IResourceItem[] = [

    {
        name: 'dashboard',
        list: '/',
        meta: {
            label: 'Dashboard',
            icon: <DashboardOutlined />
        }
    }
    ,
    {
        name: 'companies',
        list: '/companies',
        show: '/companies/:id', //to show a sinle doucment
        create: '/companies/new',
        edit: '/companies/edit/:id',

        meta: {
            label: 'Companies',
            icon: <ShopOutlined />
        }
    },
    {
        name: 'tasks',
        list: '/tasks',
        create: '/task/new',
        edit: '/tasks/edit/:id',

        meta: {
            label: 'Tasks',
            icon: <ProjectOutlined />
        }
    }
]