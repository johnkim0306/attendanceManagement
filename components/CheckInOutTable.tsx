import React from "react";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
interface CheckInOutTableProps {
    userRange: ValuePiece | [ValuePiece, ValuePiece];
}

const CheckInOutTable: React.FC<CheckInOutTableProps> = ({ userRange }) => {
    console.log("I am inside checkinOutTable: ", userRange)

    return (
        <div>
            <h2>Check-In and Check-Out Information:</h2>
        </div>
    );
};

export default CheckInOutTable;
