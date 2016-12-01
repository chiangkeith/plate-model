import React, { Component } from 'react'
import _ from 'lodash'
import truncate from 'truncate'
import More from '../components/More'

if (process.env.BROWSER) {
  require('./LatestArticles.css')
}

export default class AudioList extends Component {
  constructor(props, context) {
    super(props, context)
    this.renderTitle = this.renderTitle.bind(this)
  }

  renderTitle() {
    let title = _.get(this.props, 'title')

    return title ? (
        <div className="ui text container" style={{ marginBottom: '35px', paddingLeft: '1em !important', marginLeft: '0 !important' }}>
          <div className="article-main" style={{ textAlign: 'center' }}>
            <h2 className="hot-topic"><div className="colorBlock choice"></div>{title}<div className="blue-line" style={{ marginLeft: '16px', display:'inline-block' }}></div></h2>
          </div>
        </div>
    ) : null
  }

  render() {
    const { audios, hasMore, loadMore } = this.props

    return  (
      <div className="container">
        {this.renderTitle()}
        <div className="latest">

          { _.map(audios, (a)=>{
            //let image = imageComposer(a).mobileImage
            let image = '/asset/review.png'
            let title = _.get(a, [ 'title' ], '')
            let brief = ''
            let link = '#'

            return (
              <div className="latest-block" key={a.id || a._id} >
                <a href={link}>
                  <div className="latest-img" style={{ background: 'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
                  </div>
                </a>
                <div className="latest-content">
                  <a href={link}>
                    <h2>
                        <span dangerouslySetInnerHTML={{ __html: title }}/><div className="cat-label"><div className="separator"></div><span>VideoHub</span></div>
                    </h2>
                  </a>
                  <div className="line">
                  </div>
                  <div className="brief">
                    {truncate(brief, 75)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {hasMore ? <More loadMore={loadMore} /> : null}
      </div>
    )
  }
}

export { AudioList }
