import React from 'react'
import { Appbar } from '../components/AppBar'
import { Balance } from '../components/Balance'
import {Users} from "../components/Users"

export default function Dashboard() {
  return (
    <div>
    <Appbar />
    <div className="m-8">
        <Balance value={"10,000"} />
        <Users />
    </div>
    </div>
  )
}


