import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { getDateTime, getTimeFromStart } from '../utils/time';

export default function Clock({ session }) {
    const [loading, setLoading] = useState(true);
    const [shift, setShift] = useState(null);

    const [shiftActive, setShiftActive] = useState(false);
    const [breakActive, setBreakActive] = useState(false);
    const [lunchActive, setLunchActive] = useState(false);

    const [takenBreak, setTakenBreak] = useState(false);
    const [takenLunch, setTakenLunch] = useState(false);
    
    const [shiftClock, setShiftClock] = useState('');
    const [breakClock, setBreakClock] = useState('');
    const [lunchClock, setLunchClock] = useState('');

    useEffect(() => {
        getCurrentShift()
    }, [session])

    async function startClock(dateTime, elemID, isActive) {
        document.getElementById(elemID).innerHTML = getTimeFromStart(dateTime)
        if (!isActive) return
        setTimeout(startClock, 1000, dateTime, isActive);
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
            await getCurrentShift();
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function takeBreak() {
        try {
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
            setTakenBreak(false);
            setTakenLunch(false);
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
            setTakenBreak(true);
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
            setTakenLunch(true);
            setLoading(false);
        }
    }

    return (
        <div className="col-7">
            <div className="card">
                <div className="card-body">
                    <h1 className="card-title">Clock</h1>
                    <br/><br/>
                    <div className="row">
                        <div className='col'>
                            <h2 className="clock" id="shiftClock">{shiftClock}</h2>
                            {   shiftActive ?
                                <p className="card-text">{`Shift started at ${getDateTime(shift.created_at)}`}</p>
                                :
                                'Currently off the clock.'
                            }
                        </div>
                        <div className='col shift'>
                            <h2 className="clock" id="breakClock">{breakClock}</h2>
                            {   breakActive ?
                                <p className="card-text">{`Break started at ${getDateTime(shift.break_started_at)}`}</p>
                                :
                                <></>
                            }
                        </div>
                        <div className='col'>
                            <h2 className="clock" id="lunchClock">{lunchClock}</h2>
                            {   lunchActive ?
                                <p className="card-text">{`Lunch started at ${getDateTime(shift.lunch_started_at)}`}</p>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    <br/><br/>
                    <div className="row">
                        <div className="col">
                            {!shiftActive ?
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => beginShift()}
                                    disabled={shiftActive || loading}
                                >
                                    {loading ? <div className="spinner-border" role="status"></div> : 'Begin Shift'}
                                </button> :
                                <button
                                    className="btn btn-outline-danger"
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
                                    className="btn btn-outline-primary"
                                    onClick={() => takeBreak()}
                                    disabled={!shiftActive || loading || breakActive || lunchActive || takenBreak}
                                >
                                    {loading ? <div className="spinner-border" role="status"></div> : 'Take Break'}
                                </button> :
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => endBreak()}
                                    disabled={!shiftActive || loading || !breakActive || lunchActive}
                                >
                                    {loading ? <div className="spinner-border" role="status"></div> : 'End Break'}
                                </button>
                            }
                            <br/><br/>
                            { takenBreak ?
                                <p>Already taken break.</p>
                                :
                                <></>
                            }
                        </div>
                        <div className="col">
                            { !lunchActive ?
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => takeLunch()}
                                    disabled={!shiftActive || loading || lunchActive || breakActive || takenLunch}
                                >
                                    {loading ? <div className="spinner-border" role="status"></div> : 'Take Lunch'}
                                </button> :
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => endLunch()}
                                    disabled={!shiftActive || loading || !lunchActive || breakActive}
                                >
                                    {loading ? <div className="spinner-border" role="status"></div> : 'End Lunch'}
                                </button>
                            }
                            <br/><br/>
                            { takenLunch ?
                                <p>Already taken lunch.</p>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        </div>
    )
}