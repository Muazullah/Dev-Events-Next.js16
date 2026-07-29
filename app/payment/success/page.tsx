import { Suspense } from 'react';
import { headers } from 'next/headers';
import SuccessContent from '../../../components-temp/SuccessContent';

export default async function PaymentSuccessPage() {
    await headers();

    return (
        <section className="mt-20 max-w-2xl mx-auto px-4 text-center">
            <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </section>
    );
}