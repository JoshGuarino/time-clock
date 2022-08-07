import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import styles from '../styles/Home.module.css'
import Navbar from "../components/Navbar";
import ShiftsTable from '../components/ShiftsTable';

export default function Shifts() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <>
            { !session ?
                <main className={styles.main}>
                    <Auth/>
                </main>
                :
                <>
                    <Navbar></Navbar>
                    <main className={styles.main}>
                        <ShiftsTable session={session}/>
                    </main>
                </>
            }
        </>
    )
}