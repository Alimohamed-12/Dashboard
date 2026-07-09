import React from 'react';

function Cards({ title, value, subtitle, borderColor, iconBgColor, iconColor, Icon }) {
    return (
        <div
            className={`bg-white rounded-2xl p-6 shadow-sm border-t-4 ${borderColor}
            flex justify-between items-start
            transition-all duration-300
            hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
            cursor-pointer`}
        >
            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                    {title}
                </h3>

                <p className="text-3xl font-bold text-gray-900 mb-1">
                    {value}
                </p>

                <p className="text-gray-400 text-sm">
                    {subtitle}
                </p>
            </div>

            <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor}
                transition-transform duration-300
                hover:rotate-12 hover:scale-110`}>
                <Icon size={24} />
            </div>
        </div>
    );
}

export default Cards;
