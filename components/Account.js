import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Navbar from "./Navbar";

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [shift, setShift] = useState(null);
    const [shiftActive, setShiftActive] = useState(false);
    const [breakActive, setBreakActive] = useState(false);
    const [lunchActive, setLunchActive] = useState(false);

    useEffect(() => {
        getProfile();
        getCurrentShift();
    }, [session])

    async function getProfile() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`*`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
            }
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({ username }) {
        try {
            setLoading(true)
            const user = supabase.auth.user()

            const updates = {
                id: user.id,
                username,
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            })

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.message)
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function getCurrentShift() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data } = await supabase
                .from('shifts')
                .select(`*`)
                .eq('user_id', user.id)
                .eq('shift_active', true)
                .single();
            console.log(data);
            setShift(data);
            if (data) {
                setBreakActive(data.on_break);
                setLunchActive(data.on_lunch);
            }
            setShiftActive(!!data)

            return data;
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function beginShift() {
        try {
            if (shiftActive) return;
            setLoading(true);
            const user = supabase.auth.user();
            await supabase
                .from('shifts')
                .insert([
                    { user_id: user.id }
                ]);
            getCurrentShift();
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function takeBreak() {
        try {
            if (shift.break_ended_at) {
                alert('You have already taken a break.');
                return;
            }
            setLoading(true);
            const user = supabase.auth.user();
            await supabase
                .from('shifts')
                .update([
                    { on_break: true, break_started_at: (new Date()).toISOString() }
                ])
                .eq('user_id', user.id)
                .eq('id', shift.id);
            getCurrentShift();
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function takeLunch() {
        try {
            if (shift.lunch_ended_at) {
                alert('You have already taken lunch.');
                return;
            }
            setLoading(true);
            const user = supabase.auth.user();
            await supabase
                .from('shifts')
                .update([
                    { on_lunch: true, lunch_started_at: (new Date()).toISOString() }
                ])
                .eq('user_id', user.id)
                .eq('id', shift.id);
            getCurrentShift();
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function endShift() {
        try {
            if (!shiftActive || breakActive || lunchActive) return;
            const user = supabase.auth.user();
            setLoading(true);
            await supabase
                .from('shifts')
                .update([
                    { shift_active: false, ended_at: (new Date()).toISOString() }
                ])
                .eq('user_id', user.id)
                .eq('id', shift.id);
            getCurrentShift();
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function endBreak() {
        try {
            if (!shiftActive || !breakActive || lunchActive) return;
            const user = supabase.auth.user();
            setLoading(true);
            await supabase
                .from('shifts')
                .update([
                    { on_break: false, break_ended_at: (new Date()).toISOString() }
                ])
                .eq('user_id', user.id)
                .eq('id', shift.id);
            getCurrentShift();
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function endLunch() {
        try {
            if (!shiftActive || breakActive || !lunchActive) return;
            const user = supabase.auth.user();
            setLoading(true);
            await supabase
                .from('shifts')
                .update([
                    { on_lunch: false, lunch_ended_at: (new Date()).toISOString() }
                ])
                .eq('user_id', user.id)
                .eq('id', shift.id);
            getCurrentShift();
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="row justify-content-evenly ">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h1>Profile</h1>
                        <div className="form-widget">
                            <div>
                                <label htmlFor="email">Email</label>
                                <br/>
                                <input id="email" type="text" value={session.user.email} disabled />
                            </div>
                            <br/>
                            <div>
                                <label htmlFor="username">Name</label>
                                <br/>
                                <input
                                    id="username"
                                    type="text"
                                    value={username || ''}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <br/><br/>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => updateProfile({ username })}
                                    disabled={loading}
                                >
                                    {loading ? <div className="spinner-border" role="status"></div> : 'Update'}
                                </button>
                            </div>
                            <br/>
                            <div className="input-group mb-3">
                                <button className="btn btn-secondary" onClick={() => supabase.auth.signOut()}>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h1 className="card-title">Clock</h1>
                        <br/><br/>
                        <div className="row">
                            <p className="card-text">{ shiftActive ? `Shift started at ${new Date(shift.created_at)}` : 'Currently off the clock.' }</p>
                            <p className="card-text">{ breakActive ? `Break started at ${new Date(shift.created_at)}` : '' }</p>
                            <p className="card-text">{ lunchActive ? `Lunch started at ${new Date(shift.created_at)}` : '' }</p>
                        </div>
                        <br/><br/>
                        <div className="row">
                            <div className="col">
                                {!shiftActive ?
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => beginShift()}
                                        disabled={shiftActive || loading}
                                    >
                                        {loading ? <div className="spinner-border" role="status"></div> : 'Begin Shift'}
                                    </button> :
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => endShift()}
                                        disabled={!shiftActive || loading || breakActive || lunchActive}
                                    >
                                        {loading ? <div className="spinner-border" role="status"></div> : 'End Shift'}
                                    </button>
                                }
                            </div>
                            <div className="col">
                                { !breakActive ?
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => takeBreak()}
                                        disabled={!shiftActive || loading || breakActive || lunchActive}
                                    >
                                        {loading ? <div className="spinner-border" role="status"></div> : 'Take Break'}
                                    </button> :
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => endBreak()}
                                        disabled={!shiftActive || loading || !breakActive || lunchActive}
                                    >
                                        {loading ? <div className="spinner-border" role="status"></div> : 'End Break'}
                                    </button>
                                }
                            </div>
                            <div className="col">
                                { !lunchActive ?
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => takeLunch()}
                                        disabled={!shiftActive || loading || lunchActive || breakActive}
                                    >
                                        {loading ? <div className="spinner-border" role="status"></div> : 'Take Lunch'}
                                    </button> :
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => endLunch()}
                                        disabled={!shiftActive || loading || !lunchActive || breakActive}
                                    >
                                        {loading ? <div className="spinner-border" role="status"></div> : 'End Lunch'}
                                    </button>
                                }
                            </div>
                        </div>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
    )
}
