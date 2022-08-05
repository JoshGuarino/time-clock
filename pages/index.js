import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Account from '../components/Account'
import styles from '../styles/Home.module.css'

export default function Home() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <div className="container-fluid">
            <main className={styles.main}>
                {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
            </main>
        </div>
    )
}
