import * as c from './log'

const neverInclude = [`toUpdate`, `_stub`]
const alwaysReferencize = []

export function stubify(
  baseObject: any,
  keysToReferencize: string[] = [],
  allowRecursionDepth: number = 8,
) {
  if (!baseObject) return undefined as any

  // let objectWithGetters
  // if (
  //   !Array.isArray(baseObject) &&
  //   typeof baseObject === `object` &&
  //   !(baseObject instanceof String)
  // )
  //   objectWithGetters = applyGettersToObject(baseObject, keysToReferencize)
  // else objectWithGetters = baseObject as any
  // // c.log(`with getters`, Object.keys(gettersIncluded))

  const objectWithCircularReferencesRemoved =
    removeCircularReferences(
      baseObject,
      keysToReferencize,
      allowRecursionDepth,
    )

  const withoutFunctions = removeFunctions(
    objectWithCircularReferencesRemoved,
  )

  const withoutUndefinedProperties = removeUndefined(
    withoutFunctions,
  )

  return withoutUndefinedProperties
}

function removeFunctions(baseObject: any): any {
  if (baseObject === null) return null
  if (
    // function
    typeof baseObject === `function`
  )
    return undefined
  if (
    // string
    typeof baseObject === `string`
  )
    return baseObject
  if (
    !baseObject ||
    // not an object
    typeof baseObject !== `object`
  )
    return baseObject
  if (Array.isArray(baseObject))
    return baseObject.map(removeFunctions)

  const withoutFunctions: any = {}
  for (const key of Object.keys(baseObject)) {
    if (typeof baseObject[key] === `function`) continue
    withoutFunctions[key] = removeFunctions(baseObject[key])
  }
  return withoutFunctions
}

function removeUndefined(baseObject: any): any {
  if (baseObject === null) return null
  if (
    // string
    typeof baseObject === `string`
  )
    return baseObject
  if (
    !baseObject ||
    // not an object
    typeof baseObject !== `object`
  )
    return baseObject
  if (Array.isArray(baseObject))
    return baseObject.map(removeUndefined)

  const withoutUndefined: any = {}
  for (const key of Object.keys(baseObject)) {
    if (baseObject[key] === undefined) continue
    withoutUndefined[key] = removeUndefined(baseObject[key])
  }
  return withoutUndefined
}

// // * getters aren't naturally included in functions like Object.keys(), so we apply their result now
// function applyGettersToObject<T>(
//   baseObject: any,
//   keysToReferencize: string[] = [],
// ): T {
//   const toReference = [...alwaysReferencize, ...keysToReferencize]
//   const gettersIncluded: any = { ...baseObject }
//   const objectPrototype = Object.getPrototypeOf(baseObject)
//   const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key]
//   // c.log(Object.getOwnPropertyNames(objectPrototype))
//   for (const key of Object.getOwnPropertyNames(objectPrototype)) {
//     if (toReference.includes(key) || neverInclude.includes(key)) continue
//     const descriptor = Object.getOwnPropertyDescriptor(objectPrototype, key)
//     const hasGetter = descriptor && typeof descriptor.get === `function`
//     if (hasGetter) gettersIncluded[key] = getKeyValue(key)(baseObject)
//   }
//   return gettersIncluded as T
// }

const doNotSetFlag = `%%[do not set]%%`
const recursivelyRemoveCircularReferencesInObject = (
  obj: any,
  disallowedKeys: string[],
  remainingDepth: number,
  passedKey?: string,
  track?: boolean,
) => {
  // c.log(obj)
  let newObj: any = {}
  if (remainingDepth <= 0) {
    if (track)
      c.log(
        `reached depth limit`,
        obj,
        toRefOrUndefined(obj),
      )
    return toRefOrUndefined(obj)
  }

  // undefined
  if (obj === undefined) return doNotSetFlag

  // null
  if (obj === null) return null

  // array
  if (Array.isArray(obj)) {
    newObj = obj
      .map((v) =>
        recursivelyRemoveCircularReferencesInObject(
          v,
          disallowedKeys,
          remainingDepth - 1,
          passedKey,
          track,
        ),
      )
      .filter((v) => v !== doNotSetFlag)
  }

  // string
  else if (typeof obj === `string` || obj instanceof String)
    newObj = obj
  // object
  else if (obj !== undefined && typeof obj === `object`) {
    for (const key of Object.keys(obj)) {
      const value = obj[key]

      // null/undefined
      if (value === null || value === undefined) {
        newObj[key] = undefined
      }

      // never include key => marker to not set value
      else if (neverInclude.includes(key))
        newObj[key] = doNotSetFlag
      // disallowed key => stub
      else if (
        disallowedKeys.includes(key) &&
        typeof value === `object` &&
        !Array.isArray(value)
      ) {
        newObj[key] = toRefOrUndefined(value)
      }

      // nested object
      else if (typeof value === `object`) {
        const res =
          recursivelyRemoveCircularReferencesInObject(
            value,
            disallowedKeys,
            remainingDepth - 1,
            key,
            track,
          )
        if (res !== doNotSetFlag) newObj[key] = res
      }

      // anything else
      else {
        newObj[key] = value
      }

      // clear anything that came back as a DNS flag
      if (newObj[key] === doNotSetFlag) delete newObj[key]
    }
  }
  // fallback
  else newObj = obj

  if (track) c.log(`tracked`, passedKey, obj, newObj)

  return newObj
}

function removeCircularReferences<T>(
  baseObject: T,
  keysToReferencize: string[] = [],
  allowRecursionDepth: number,
): T {
  const toReference = [
    ...alwaysReferencize,
    ...keysToReferencize,
  ]

  return recursivelyRemoveCircularReferencesInObject(
    baseObject,
    toReference,
    allowRecursionDepth,
  ) as T
}

const toRefOrUndefined = (obj: any) => {
  if (!obj) return null

  if (typeof obj === `string` || obj instanceof String)
    return obj

  if (typeof obj !== `object`) return obj

  if (obj.toReference) return obj.toReference()

  const returnObj: any = {}
  if (obj.id) returnObj.id = obj.id
  if (obj.name) returnObj.name = obj.name
  if (obj.type) returnObj.type = obj.type
  if (Object.keys(returnObj).length === 0) return undefined
  return returnObj
}
