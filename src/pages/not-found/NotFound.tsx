// src/pages/not-found/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {ROUTES} from "../../router/routes.ts";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
            <Link
                to={ROUTES.HOME}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors border-2 border-blue-800"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
};

export default NotFound;