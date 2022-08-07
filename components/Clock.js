import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { getDateTime, getTimeDiff } from '../utils/time';

export default function Clock({ session }) {
    const [loading, setLoading] = useState(true);
    const [shift, setShift] = useState(null);

    const [shiftActive, setShiftActive] = useState(false);
    const [breakActive, setBreakActive] = useState(false);
    const [lunchActive, setLunchActive] = useState(false);

    const [takenBreak, setTakenBreak] = useState(false);
    const [takenLunch, setTakenLunch] = useState(false);

    useEffect(() => {
        getCurrentShift();
    }, [session])

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
            setShift(data);
            if (data) {
                setBreakActive(data.on_break);
                setLunchActive(data.on_lunch);
                if (data.break_ended_at) setTakenBreak(true);
                if (data.lunch_ended_at) setTakenLunch(true);
            }
            setShiftActive(!!data);

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
        <div className="col-8">
            <div className="card">
                <div className="card-body">
                    <h1 className="card-title">Clock</h1>
                    <br/><br/>
                    <div className="row">
                        <div className='col text-center'>
                            <h2 className="turq" id="shiftClock">Shift</h2>
                            <br/><br/>
                            {   shiftActive ?
                                <p className="card-text">Shift started <span className="turq">--</span> {getDateTime(shift.created_at)}</p>
                                :
                                'Currently off the clock'
                            }
                        </div>
                        <div className='col text-center'>
                            <h2 className="turq" id="breakClock">Break</h2>
                            <br/><br/>
                            {   breakActive ?
                                <p className="card-text">Break started <span className="turq">--</span> {getDateTime(shift.break_started_at)}</p>
                                :
                                <></>
                            }
                            { takenBreak ?
                                <p>Break was <span className="turq">--</span> <span className="brown">{getTimeDiff(shift.break_started_at, shift.break_ended_at)}</span></p>
                                :
                                <></>
                            }
                        </div>
                        <div className='col text-center'>
                            <h2 className="turq" id="lunchClock">Lunch</h2>
                            <br/><br/>
                            {   lunchActive ?
                                <p className="card-text">Lunch started at <span className="turq">--</span> {getDateTime(shift.lunch_started_at)}</p>
                                :
                                <></>
                            }
                            { takenLunch ?
                                <p>Lunch was <span className="turq">--</span> <span className="brown">{getTimeDiff(shift.lunch_started_at, shift.lunch_ended_at)}</span></p>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    <br/><br/>
                    <div className="row">
                        <div className="col text-center">
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
                        <div className="col text-center">
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
                        </div>
                        <div className="col text-center">
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
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        </div>
    )
}