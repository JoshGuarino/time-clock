import { useEffect, useState } from "react";
import { supabase } from '../utils/supabaseClient'
import { getDateTime, getTimeDiff } from "../utils/time";

export default function ShiftsTable({ session }) {
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getShifts().then((r) =>{
            setShifts(r);
        });
    }, [session])

    async function getShifts(page = 1) {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data } = await supabase
                .from('shifts')
                .select(`*`)
                .eq('user_id', user.id)
                .order('id', { ascending: false })
                .range(page*10-10, page*10-1);
            getTotalShifts().then((r)=>{
               setTotalPages(Math.ceil(r / 10));
            });

            return data;
        } catch(error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    }

    async function getTotalShifts() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data } = await supabase
                .from('shifts')
                .select(`*`)
                .eq('user_id', user.id);

            return data.length;
        } catch(error) {
            alert(error.message);
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="row">
            <div className="col"></div>
            <div className="col-10 table-cont">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Shift [start <span className="blue">--</span> end]</th>
                            <th scope="col">Shift Length</th>
                            <th scope="col">Break Length</th>
                            <th scope="col">Lunch Length</th>
                            <th scope="col">View</th>
                        </tr>
                        </thead>
                        {loading ?
                            <>
                            <br/>
                            <div className="spinner-border" role="status"></div>
                            </>
                            :
                            <tbody>
                            {
                                shifts.map((shift, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{getDateTime(shift.created_at)} <span
                                                className="blue">--</span> {shift.shift_active ? 'Present' : getDateTime(shift.ended_at)}
                                            </td>
                                            <td>
                                                {shift.shift_active ?
                                                    <span className="green">Currently Active</span>
                                                    :
                                                    <span
                                                        className="brown">{getTimeDiff(shift.created_at, shift.ended_at)}</span>
                                                }
                                            </td>
                                            <td>
                                                {shift.on_break ?
                                                    <span className="green">Currently Active</span>
                                                    :
                                                    <span className="brown">{!shift.break_ended_at ? <span
                                                        className="blue">Not Taken</span> : getTimeDiff(shift.break_started_at, shift.break_ended_at)}</span>
                                                }
                                            </td>
                                            <td>
                                                {shift.on_lunch ?
                                                    <span className="green">Currently Active</span>
                                                    :
                                                    <span className="brown">{!shift.lunch_ended_at ? <span
                                                        className="blue">Not Taken</span> : getTimeDiff(shift.lunch_started_at, shift.lunch_ended_at)}</span>
                                                }
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-info"
                                                    onClick={() => {
                                                    }}
                                                >
                                                    Detail View
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        }
                    </table>
                    <br/>
                    <div className="row">
                        <div className="col text-center">
                            <button className="btn btn-outline-secondary" onClick={() => {
                                if (page > 1) {
                                    setPage(page-1)
                                    getShifts(page-1).then((r) =>{
                                        setShifts(r);
                                    })
                                }
                            }}>
                                Previous
                            </button>
                        </div>
                        <div className="col text-center">
                            <h5>Current Page : <span className="blue">{page}</span></h5>
                        </div>
                        <div className="col text-center">
                            <button className="btn btn-outline-secondary"  onClick={() => {
                                if (page < totalPages) {
                                    setPage(page+1);
                                    getShifts(page+1).then((r) => {
                                        setShifts(r);
                                    })
                                }
                            }}>
                                Next
                            </button>
                        </div>
                    </div>
                    <br/>
            </div>
            <div className="col"></div>
        </div>
    );
}