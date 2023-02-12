import Head from 'next/head'
import { useRef, useState } from 'react'
type ItemType = {
  type: string,
  props: any
}
const ComponentFromType = ({ type, ...props }) => {
  switch(type){
    case 'text': {
      return <pre {...props}/>
    }
    case 'image': {
      return <img {...props}/>
    }
    case 'form': {
      return <form {...props}/>
    }
    case 'input-text': {
      return <input type="text" {...props}/>
    }
    case 'input-submit': {
      return <input type="submit" {...props}/>
    }
    default:
      return <div>type {type} not recognised.</div>
  }
}
const createItemFromSelectableItem = (selectableItem): ItemType => {
  const out = { type: selectableItem.text, props: {} } as ItemType
  switch(out.type){
    case 'text': {
      out.props.children = 'Edit my text'
      break;
    }
    case 'image': {
      out.props.src = 'https://via.placeholder.com/150'
      break;
    }
    case 'form': {
      out.props.children = 'Empty form'
      break;
    }
    case 'input-text': {
      out.props.value = ''
      out.props.placeholder = 'Enter text here'
      break;
    }
    case 'input-submit': {
      out.props.value = 'Submit'
      break;
    }
    default: {

    }
  }
  return out
}
const App = ({
  className = ''
}) => {
  const selectedIndex = useRef(0)
  const [tree, setTree] = useState(new Map())
  
  const selectableItems = [
    {
      text: 'text'
    },
    {
      text: 'image'
    },
    {
      text: 'form'
    },
    {
      text: 'input-text'
    },
    {
      text: 'input-submit'
    }
  ]
  const [selectedItem, setSelectedItem] = useState(selectableItems[0])

  const addItem = (index, item) => {
    setTree(tree => {
      const newTree = new Map(tree)
      newTree.set(index, item)
      return newTree
    })
  }
  return (
    <div
      className={className}
    >
      <div>
        {selectableItems.map(item => {
          return <div key={item.text}><button
            onClick={() => {
              setSelectedItem(item)
            }}
          >Select</button> {item.text} {selectedItem.text === item.text && '- Selected'}</div>
        })}
      </div>
      <div>
        {Array.from(tree, ([index, item]) => {
          console.log('tree item', index, item)
          return <ComponentFromType type={item.type} {...item.props}/>
        })}
      </div>
      <button onClick={() => {
        addItem(selectedIndex.current, createItemFromSelectableItem(selectedItem))
        selectedIndex.current ++
      }}>+</button>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>WYSIWYG</title>
        <meta name="description" content="What you see is what you get." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <App/>
      </main>
    </div>
  )
}
