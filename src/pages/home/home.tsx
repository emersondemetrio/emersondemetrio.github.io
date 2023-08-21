import 'react';

import { Links } from '../../constants';

export const Home = () => {
    return (
        <>
            <section className="page-section" id="services">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <h3 className="section-heading text-uppercase">
                                Links
                            </h3>
                        </div>
                    </div>
                    {Links.map((link) => {
                        return (
                            <div className="row" key={link.title} style={{
                                marginBottom: 10,
                            }}>
                                <div className="col-lg-12 text-center" >
                                    <a
                                        style={{
                                            marginBottom: 10,
                                            width: 200
                                        }}
                                        className="btn btn-xl btn-secondary text-uppercase"
                                        href={link.url}
                                        target='_blank'
                                    >
                                        {link.title}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                    <div className="row text-center"></div>
                </div>
            </section>
        </>
    )
}