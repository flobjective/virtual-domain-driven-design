import React, { ReactElement, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons"

const Book = ({ book }) => {
  return (
    <div className="group bg-white w-48 rounded-lg shadow-md m-2 flex flex-col items-center justify-start">
      <Img
        className="my-2 w-48 h-64"
        fluid={book.img.childImageSharp.fluid}
        imgStyle={{ objectFit: "contain" }}
      ></Img>
      <div className="px-1 w-full flex flex-row flex-wrap">
        {book.tags.map((tag, index) => {
          return (
            <div className="flex-shrink-0 leading-none text-xs tracking-tighter bg-gray-200 text-gray-700 rounded-md p-1 m-1">
              {tag}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Books = (): ReactElement => {
  const pageLimit = 6
  const [currentPage, setCurrentPage] = useState(1)
  const allBooks = useStaticQuery(graphql`
    query {
      allContentYaml(
        filter: { books: { elemMatch: { title: { ne: null } } } }
      ) {
        nodes {
          books {
            author
            title
            tags
            img {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  `).allContentYaml.nodes[0].books
  const totalBooksLength = allBooks.length

  const defineRightArrowVisibility = (newPage) => {
    if (totalBooksLength > pageLimit * newPage) {
      return ""
    } else {
      return "invisible"
    }
  }

  const [leftInvisible, setLeftInvisible] = useState("invisible")
  const [rightInvisible, setRightInvisible] = useState(
    defineRightArrowVisibility(1)
  )

  const offset = (currentPage - 1) * pageLimit
  const [currentBooks, setCurrentBooks] = useState(
    allBooks.slice(offset, offset + pageLimit)
  )

  const handleMoveLeft = () => {
    const newPage = currentPage - 1
    const offset = (newPage - 1) * pageLimit
    pageChange(offset, newPage)
  }

  const handleMoveRight = () => {
    const newPage = currentPage + 1
    const offset = (newPage - 1) * pageLimit
    pageChange(offset, newPage)
  }

  const pageChange = (offset, newPage) => {
    setCurrentPage(newPage)
    setCurrentBooks(allBooks.slice(offset, offset + pageLimit))
    if (newPage > 1) {
      setLeftInvisible("")
    } else {
      setLeftInvisible("invisible")
    }
    setRightInvisible(defineRightArrowVisibility(newPage))
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="my-6 lg:w-2/3 xl:w-1/2">Books</h2>
      <div className="flex flex-row justify-center">
        <div className="flex justify-center items-center w-1/20">
          <button
            onClick={handleMoveLeft}
            className={
              leftInvisible +
              " transition duration-500 text-blue-700 hover:text-blue-400"
            }
          >
            <FontAwesomeIcon icon={faChevronCircleLeft} size="4x" />
          </button>
        </div>
        <div className="flex flex-row flex-wrap items-center w18/20">
          {currentBooks.map((book, index) => {
            return <Book book={book}></Book>
          })}
        </div>
        <div className="flex justify-center items-center w-1/20">
          <button
            onClick={handleMoveRight}
            className={
              rightInvisible +
              " transition duration-500 text-blue-700 hover:text-blue-400"
            }
          >
            <FontAwesomeIcon icon={faChevronCircleRight} size="4x" />
          </button>
        </div>
      </div>
    </div>
  )
}

export const getQuery

export default Books
