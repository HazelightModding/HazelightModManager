import React, { useState } from "react";

interface SwitchProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked = false, onChange }) => {
    return (
        <label className="relative inline-flex h-4 w-20 items-center justify-between">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange?.(!checked)}
                className="absolute h-0 w-0 opacity-0"
            />
            <span
                className={`slider bg-primary-1 absolute inset-0 flex items-center rounded-full transition-all duration-300`}
            >
                <span
                    className={`h-7 w-7 rounded-full transition-all duration-300 ${checked ? "bg-lime-400 saturate-80" : "bg-red-500"} ${checked ? "translate-x-13 transform" : ""}`}
                ></span>
            </span>
        </label>
    );
};

export default Switch;
