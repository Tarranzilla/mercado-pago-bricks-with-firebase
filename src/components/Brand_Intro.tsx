import Image from "next/image";

const Brand_Intro = () => {
    return (
        <div className="Brand_Intro">
            <h1>TROPICAL CACAU</h1>
            <div className="Intro_Image_Container">
                <Image src="/brand_imgs/Icone_TC_512.png" alt="Chocolate Box" width={400} height={400} quality={100} className="Intro_Image" />
            </div>
        </div>
    );
};

export default Brand_Intro;
