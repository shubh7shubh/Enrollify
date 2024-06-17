import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="border-t">
            <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
                <Link href='/'>
                    <Image
                        className="rounded-lg"
                        src="/assets/images/enroll.png"
                        alt="logo"
                        width={128}
                        height={38}
                    />
                </Link>

                <p>2023 Enrollify. All Rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer