export default function Videoplayer(props) {
    return (
        <>
            <video id="videoPlayer" className="react-player" controls poster={props.thumbnail}>
                <source src={props.videourl} type="video/mp4"></source>
            </video>
        </>
    )
}



