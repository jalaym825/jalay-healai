import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './Navbar'

function UserLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}

export default UserLayout
