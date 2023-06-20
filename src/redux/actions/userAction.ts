import { AppDispatch } from '../store';
import axios from 'axios'

import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,

  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL, 

  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAIL,

  USER_SESSION_REQUEST,
  USER_SESSION_SUCCESS,
  USER_SESSION_FAIL
} from '../types/user';

import { BASE_URL } from '../../config';
// register
export const register = (username:string, email:string, password:string, token: string) => async (dispatch:AppDispatch) => {

  try {
      dispatch({ type: USER_REGISTER_REQUEST })

      const { data } = await axios.post(`${BASE_URL}/api/user/register/`,
          { 'username': username, 'email': email, 'password': password },
          {
            withCredentials: true,
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": token,
          }}
      )
      dispatch({
          type: USER_REGISTER_SUCCESS,
          payload: data.result.email
      })
      
  }
  catch (error) {
      dispatch({
          type: USER_REGISTER_FAIL,
      })
  }
}

export const login = (username:string, password:string, token: string) => async (dispatch:AppDispatch) => {

    try {
        dispatch({ type: USER_LOGIN_REQUEST })
  
        const { data } = await axios.post(`${BASE_URL}/api/user/login/`,
            { 'username': username, 'password': password },
            {
                withCredentials: true,
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": token,
              }}
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data.email
        })
    }
    catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
        })
    }
  }

  export const logout = () => async (dispatch: AppDispatch) => {
    try {
        dispatch({ type: USER_SESSION_REQUEST })
  
        await axios.get(`${BASE_URL}/api/user/logout`, { withCredentials: true })
        
        dispatch({
            type: USER_SESSION_SUCCESS,
        })
        dispatch({ type: "session/logout" });

    }
    catch (error) {
        dispatch({
            type: USER_SESSION_FAIL,
        })
    }
  }
  