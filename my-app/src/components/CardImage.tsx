import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { imagePlaceholder, axiosImage } from '../api'

interface CardImageProps {
    url: string;
    className?: string;
}

const CardImage = ({ url, className, ...props }: CardImageProps) => {
    const [src, setSrc] = useState(imagePlaceholder);

    useEffect(() => {
        if (!url) {
            return
        }
        axiosImage.get(url, { responseType: 'blob' })
            .then(response => {
                if (response.status >= 500 || response.headers.server === 'GitHub.com') {
                    throw new Error(`Can't load image from ${url}`);
                }
                setSrc(URL.createObjectURL(response.data));
            })
            .catch(error => {
                console.error(error.message);
            });

    }, []);

    const handleError = () => {
        console.error(`Error loading image: ${url}`);
    };

    return <Card.Img src={src} className={className} onError={handleError} {...props} />;
};

export default CardImage;