import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

function UserLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}

export default UserLayout
