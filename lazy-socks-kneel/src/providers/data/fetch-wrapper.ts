import { access } from "fs"
import {GraphQLFormattedError} from "graphql"

type Error = {
    message  :string,
    statusCode : string
}

const customFetch = async (url : string, options : RequestInit) =>{
    const accessToken = localStorage.getItem('access_token')

    const headers = options.headers as Record<string, string>

    //normal fetch, gving URL, headers, payload etc
    return await fetch(url,{
        ...options,
        headers : {
            ...headers,
            Authorization : headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type" : "application/json",
            "Apollo-Require-Preflight" : "true", //used in graphL requests, to check if server allows requested operation before actually sending main request, relate to CORS

        }
    })
}

const getGraphQLErrors = (body : Record<"errors", GraphQLFormattedError[] | undefined>) : 
Error | null =>{
    //no body received
if(!body){
    return {
        message : 'Unknown',
        statusCode : "INTERNAL_SERVER_ERROR"
    }
}
//if errors in body received
if("errors" in body){
    const errors = body?.errors
    const messages = errors?.map((error)=>error?.message)?.join("")
    const code = errors?.[0]?.extensions?.code
    return {
        message : messages || JSON.stringify(errors),
        statusCode : code || 500
    }
}
return null

}

//wraps custom fetch and graphQL errors
export const fetchWrapper = async (url : string, options : RequestInit) =>{
    const response = await customFetch(url, options)

    //to ensure response can be consumed twice
    const responseClone = response.clone()
    const body = await responseClone.json()
    const error = getGraphQLErrors(body)
    if(error){
        throw error
    }
    return response
}