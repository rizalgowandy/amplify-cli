import TransformerContext from './TransformerContext'
import {
    DirectiveDefinitionNode,
    parse,
    DirectiveNode,
    ObjectTypeDefinitionNode,
    InterfaceTypeDefinitionNode,
    FieldDefinitionNode,
    UnionTypeDefinitionNode,
    Kind,
    EnumTypeDefinitionNode,
    ScalarTypeDefinitionNode,
    InputObjectTypeDefinitionNode
} from 'graphql'
import { InvalidDirectiveDefinitionError } from './errors'

/**
 * A GraphQLTransformer takes a context object, processes it, and
 * returns a new context. The transformer is responsible for returning
 * a context that fully describes the infrastructure requirements
 * for its stage of the transformation.
 */
export default class Transformer {

    public name: string

    public directive: DirectiveDefinitionNode

    /**
     * Each transformer has a name.
     *
     * Each transformer defines a set of directives that it knows how to translate.
     */
    constructor(
        name: string,
        directiveDef: string
    ) {
        this.name = name
        const doc = parse(directiveDef);
        if (doc.definitions.length !== 1) {
            throw new InvalidDirectiveDefinitionError('Transformers must specify exactly one directive definition.')
        }
        const def = doc.definitions[0]
        if (def.kind !== Kind.DIRECTIVE_DEFINITION) {
            throw new InvalidDirectiveDefinitionError(`Transformers must specify a directive definition not a definition of kind '${def.kind}'.`)
        }
        this.directive = def
    }

    /**
     * An initializer that is called once at the beginning of a transformation.
     * Initializers are called in the order they are declared.
     */
    before?: (acc: TransformerContext) => void

    /**
     * An initializer that is called once at the beginning of a transformation.
     * Initializers are called in the order they are declared.
     */
    after?: (acc: TransformerContext) => void

    /**
     * A transformer implements a single function per location that its directive can be applied.
     * This method handles transforming directives on objects type definitions. This includes type
     * extensions.
     */
    object?: (definition: ObjectTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void

    /**
     * A transformer implements a single function per location that its directive can be applied.
     * This method handles transforming directives on objects type definitions. This includes type
     * extensions.
     */
    interface?: (definition: InterfaceTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void

    /**
     * A transformer implements a single function per location that its directive can be applied.
     * This method handles transforming directives on object or interface field definitions.
     */
    field?: (definition: FieldDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void

    /**
     * A transformer implements a single function per location that its directive can be applied.
     * This method handles transforming directives on union definitions.
     */
    union?: (definition: UnionTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void

    /**
     * A transformer implements a single function per location that its directive can be applied.
     * This method handles transforming directives on enum definitions.
     */
    enum?: (definition: EnumTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void

    /**
     * A transformer implements a single function per location that its directive can be applied.
     * This method handles transforming directives on scalar definitions.
     */
    scalar?: (definition: ScalarTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void

    /**
     * A transformer implements a single function per location that its directive can be applied.
     * This method handles transforming directives on input definitions.
     */
    input?: (definition: InputObjectTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void

}


function makeDirectiveDefinitions(directiveSpec: string) {
    return parse(directiveSpec).definitions
}