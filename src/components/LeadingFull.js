import { AD_UNIT_PREFIX, DFPID } from '../constants/index'
import { AdSlot } from 'react-dfp'
import { imageComposer } from '../utils/index'
import _ from 'lodash'
import React, { Component } from 'react'
import dateformat from 'dateformat'
import entities from 'entities'
import ga from 'react-ga'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

if (process.env.BROWSER) {
  require('./LeadingFull.css')
}

export default class LeadingFull extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick() {
    ga.event({
      category: this.props.pathName,
      action: 'click',
      label: 'leadingFull'
    })
  }

  render() {
    const { articles, section } = this.props
    let sortedArticles = _.sortBy(articles, function (o) { return new Date(o.publishedDate) }).reverse()

    return (
      <div>
        <div className="leadingFull__gradient"></div>
        { _.map(_.take(sortedArticles, 2), (a, i)=>{
          let image = imageComposer(a).desktopImage
          let title = sanitizeHtml( _.get(a, [ 'title' ], ''), { allowedTags: [ ] })
          let hasRelated = _.difference(a.relateds, [ null, '' ]).length > 0 ? 'static' : 'none'
          let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'

          let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
          let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
          let briefContent = (brief.length >0) ? brief : content

          let writers = '文｜' + _.map(a.writers, 'name').join('、')
          let relateds = _.filter(a.relateds, 'id')
          return (
            <section className="" key={'choiceFull' + a.id}>
              <a href={linkStyle+a.slug+'/'} onClick={ this._handleClick }>
                <figure className="post-image" style={{ background: 'url('+ image +') no-repeat center center', backgroundSize: 'cover' }}></figure>
              </a>
              <div className="post-block">
                <div className="post meta">
                  <div className="author">
                    { (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }
                  </div>
                  <div className="date">{ dateformat(a.publishedDate, 'yyyy.mm.dd') }</div>
                </div>
                <div className="post content">
                  <a href={linkStyle+a.slug+'/'} onClick={ this._handleClick }>
                    <div className="post title">
                      <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
                    </div>
                  </a>
                  <div className="post brief">
                    <a href={linkStyle+a.slug+'/'} onClick={ this._handleClick }>{ truncate(entities.decodeHTML(briefContent), 100) + ' <more>'}</a>
                  </div>
                </div>
                <div className="post dfp">
                  <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '320px', textAlign: 'center' } } data-pos={ 'R' + (i + 1) }>
                    <AdSlot sizes={ (i === 0 ) ? [ [ 300, 250 ] ] : ((hasRelated === 'none') ? [ [ 300, 250 ] ] : [ [ 300, 250 ], [ 300, 600 ] ]) }
                      dfpNetworkId={DFPID}
                      slotId={ 'mm_pc_' + AD_UNIT_PREFIX[ section ] + '_' + ((i === 0 ) ? '300x250' : '300x600') + '_R' + (i + 1) }
                      adUnit={ 'mm_pc_' + AD_UNIT_PREFIX[ section ] + '_' + ((i === 0 ) ? '300x250' : '300x600') + '_R' + (i + 1) }
                      sizeMapping={
                        [
                          { viewport: [   0,   0 ], sizes: [ ] },
                          { viewport: [ 970, 200 ], sizes: (i === 0 ) ? [ [ 300, 250 ] ] : ((hasRelated === 'none') ? [ [ 300, 250 ] ] : [ [ 300, 250 ], [ 300, 600 ] ]) }
                        ]
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="related-post-block" style={{ display: hasRelated }} >
                <div className="related-post-container">
                  <span>相關文章 Related Stories</span>
                  <div className="related-divider"></div>
                    { _.map(_.take(relateds, 2), (r)=>{
                      let image = imageComposer(r).mobileImage
                      let linkStyle = (_.get(r, 'style', '') == 'projects') ? '/projects/' : '/story/'

                      let brief = sanitizeHtml( _.get(r, [ 'brief','html' ], ''), { allowedTags: [ ] })
                      let content = sanitizeHtml( _.get(r, [ 'content','html' ], ''), { allowedTags: [ ] })
                      let briefContent = (brief.length >0) ? brief : content
                      let writers = '文｜' + _.map(r.writers, 'name').join('、')

                      return (
                        <div className="related-post" key={ r.id} >
                          <a href={linkStyle+r.slug+'/'} onClick={ this._handleClick }>
                            <figure className="related-post__img" style={{ background: 'url('+ image +') no-repeat center center', backgroundSize:'cover' }}></figure>
                          </a>
                          <div className="related-post__content">
                            <a href={linkStyle+r.slug+'/'} onClick={ this._handleClick }>
                              <div className="related-post__title"> { r.title }</div>
                            </a>
                            <div className="related-post__brief">
                              <a href={linkStyle+r.slug+'/'} onClick={ this._handleClick }>{ truncate(entities.decodeHTML(briefContent), 55) }</a>
                            </div>
                            <div className="related-post__meta">
                              <div className="related-post__author">
                                { (_.get(r, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }
                              </div>
                              <div className="related-post__date">{ dateformat(r.publishedDate, 'yyyy.mm.dd') }</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
              { (i !== 0) ? null : _.find(this.props.children, { props : { 'data-pos' : 'L1' } }) }
            </section>
          )
        })}
      </div>
    )
  }
}

export { LeadingFull }
