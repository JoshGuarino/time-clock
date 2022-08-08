import { useEffect, useState } from "react";
import { supabase } from '../utils/supabaseClient'
import { getDateTime, getTimeDiff } from "../utils/time";

export default function ShiftsTable({ session }) {
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getShifts().then((r) =>{
            setShifts(r);
        })
    }, [session])

    async function getShifts() {
        try {
            const user = supabase.auth.user();

            let { data } = await supabase
                .from('shifts')
                .select(`*`)
                .eq('user_id', user.id)
                .order('id', { ascending: false });

            return data;
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
            { loading || !shifts ?
                <div className="spinner-border" role="status"></div>
                :
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Shift [start <span className="turq">--</span> end]</th>
                        <th scope="col">Shift Length</th>
                        <th scope="col">Break Length</th>
                        <th scope="col">Lunch Length</th>
                    </tr>
                    </thead>
                    <tbody>
                    {  
                        shifts.map((shift, index) => {
                            return(
                                <tr key={index}>
                                    <th scope="row">{index+1}</th>
                                    <td>{getDateTime(shift.created_at)} <span className="turq">--</span> {shift.shift_active ? 'Present' : getDateTime(shift.ended_at)}</td>
                                    <td>
                                        {   shift.shift_active ?
                                            <span className="green">Currently Active</span>
                                            :
                                            <span className="brown">{getTimeDiff(shift.created_at, shift.ended_at)}</span>
                                        }
                                    </td>
                                    <td>
                                        {   shift.on_break ?
                                            <span className="green">Currently Active</span>
                                            :
                                            <span className="brown">{!shift.break_ended_at ? <span className="turq">Not Taken</span> : getTimeDiff(shift.break_started_at, shift.break_ended_at)}</span>
                                        }
                                    </td>
                                    <td>
                                        {   shift.on_lunch ?
                                            <span className="green">Currently Active</span>
                                            :
                                            <span className="brown">{!shift.lunch_ended_at ? <span className="turq">Not Taken</span> : getTimeDiff(shift.lunch_started_at, shift.lunch_ended_at)}</span>
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>   
            }
            </div>
            <div className="col"></div>
        </div>
    );
}