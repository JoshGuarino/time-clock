import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import Swal from 'sweetalert2'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (email) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email })
            if (error) throw error
            new Swal('Check your email for the login link!')
        } catch (error) {
            new Swal(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="row flex flex-center">
            <div className="col"></div>
            <div className="col">
                <h1 className="header">Time Clock</h1>
                <br/>
                <div className="col-12 form-widget">
                    <p className="description">Sign in via magic link with your email below</p>
                    <br/>
                    <div className="input-group mb-3">
                            <input
                                className="inputField form-control"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                    </div>
                    <br/>
                    <div className="input-group mb-3">
                        <div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleLogin(email)
                                }}
                                className="btn btn-secondary form-control"
                                disabled={loading}
                            >
                                <span>{loading ? <div className="spinner-border" role="status"></div> : 'Send magic link'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col"></div>
        </div>
    )
}