// code to setup graphQL client

import graphqlDataProvider,{ GraphQLClient, liveProvider as graphqlLiveProvider } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const API_BASE_URL = 'https://api.crm.refine.dev'
export const API_URL = 'https://api.crm.refine.dev'  //base URL for graphQL API
export const WS_URL = 'wss://api.crm.refine.dev/graphql'


export const client = new GraphQLClient(API_URL,{

    //overrides default fetch beahviour of client
    fetch : (url : string, options: RequestInit) =>{
        try{
            return fetchWrapper(url, options)
        }
        catch(error){
            //convert error to a rejected Promise
            return Promise.reject(error as Error)
        }
    }
})

export const wsClient = typeof window !== "undefined"
?
createClient({
    url : WS_URL,
    connectionParams : () =>{
        const accessToken = localStorage.getItem("access_token")

        return {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        }
    }
})
:
undefined

export const dataProvider = graphqlDataProvider(client) //takes client and return data provider
export const liveProvider =wsClient ?  graphqlLiveProvider(wsClient) : undefined