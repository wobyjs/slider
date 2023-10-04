import { $, type JSX } from "voby"

interface DemoProps {
    title: string
    children?: JSX.Child
}

function Demo({ title, children }: DemoProps) {
    const source = $(false)

    const handleToggle = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        source(!source)
    }

    const className = ["bg-white pt-5 rounded-bl rounded-br ", { source: source }]

    return (
        <div className="demo-panel border mb-20 border-[solid] [&_.slider]:p-[40px] w-[80%] my-0 mx-auto">
            <div
                className="demo-panel-title
bg-[#2d2d2d] bg-[smoke] overflow-hidden px-5 py-2.5 border-b-[50%)_solid] border-b after:clear-both
before:table before:content-['_']
after:table after:content-['_'] after:clear-both
[&_h4]:text-[white] [&_h4]:font-bold [&_h4]:float-left text-[16px]
[&_a]:text-[white] [&_a]:float-right [&_a]:mx-[20px]
            ">
                <h4>{title}</h4>
                <a id="source" onClick={handleToggle} href="#">
                    View Source
                </a>
                <a id="codesandbox" onClick={handleToggle} href="#">
                    Code Sandbox
                </a>
            </div>
            <div className={className}>{children}</div>
        </div >
    )
}

export default Demo
