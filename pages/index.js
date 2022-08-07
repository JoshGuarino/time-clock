import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Profile from '../components/Profile'
import Clock from '../components/Clock'
import styles from '../styles/Home.module.css'
import Navbar from "../components/Navbar";

export default function Home() {
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
                        <div className="row justify-content-evenly ">
                            <Profile key={session.user.id} session={session} />
                            <Clock key={session.user.id} session={session} />
                        </div>
                    </main>
                </>
            }
        </>
    )
}
