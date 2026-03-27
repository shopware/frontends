import { describe, expect, it } from "vitest";
import {
  dtoToFileName,
  generateAllFiles,
  generatePhpClass,
  generatePreserveNullAttribute,
} from "../../src/php-dto/generator";
import type { DtoDefinition } from "../../src/php-dto/schemaParser";

describe("generator", () => {
  describe("dtoToFileName", () => {
    it("appends .php extension", () => {
      expect(dtoToFileName("ProductDTO")).toBe("ProductDTO.php");
    });
  });

  describe("generatePhpClass", () => {
    it("generates a basic class with required and optional properties", () => {
      const dto: DtoDefinition = {
        name: "ContactFormRequestDTO",
        description: "Contact form request",
        properties: [
          {
            name: "email",
            phpType: "string",
            nullable: false,
            required: true,
            description: "Email address",
            isArray: false,
          },
          {
            name: "firstName",
            phpType: "string",
            nullable: false,
            required: false,
            isArray: false,
          },
          {
            name: "nickname",
            phpType: "string",
            nullable: true,
            required: false,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("<?php declare(strict_types=1);");
      expect(result).toContain("class ContactFormRequestDTO");
      expect(result).toContain(" * Contact form request");
      expect(result).toContain("public function __construct(");
      expect(result).toContain("/** Email address */");
      expect(result).toContain("#[Assert\\NotBlank]");
      expect(result).toContain("public string $email,");
      expect(result).toContain("public ?string $firstName = null,");
      expect(result).toContain("public ?string $nickname = null,");
      expect(result).toContain("    ) {");
      expect(result).not.toContain("namespace");
    });

    it("adds namespace when provided", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "id",
            phpType: "string",
            nullable: false,
            required: true,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto, { namespace: "App\\DTO" });

      expect(result).toContain("namespace App\\DTO;");
    });

    it("uses NotBlank for required strings, NotNull for other required types", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "id",
            phpType: "string",
            nullable: false,
            required: true,
            isArray: false,
          },
          {
            name: "count",
            phpType: "int",
            nullable: false,
            required: true,
            isArray: false,
          },
          {
            name: "label",
            phpType: "string",
            nullable: false,
            required: false,
            isArray: false,
          },
          {
            name: "status",
            phpType: "string",
            nullable: true,
            required: true,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "use Symfony\\Component\\Validator\\Constraints as Assert;",
      );
      expect(result).toContain(
        "#[Assert\\NotBlank]\n        public string $id,",
      );
      expect(result).toContain(
        "#[Assert\\NotNull]\n        public int $count,",
      );
      expect(result).not.toContain(
        "#[Assert\\NotBlank]\n        public ?string $label",
      );
      expect(result).not.toContain(
        "#[Assert\\NotBlank]\n        public ?string $status",
      );
      expect(result).toContain("public ?string $label = null,");
      expect(result).toContain("public ?string $status = null,");
    });

    it("adds Assert import when patterns exist", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "id",
            phpType: "string",
            nullable: false,
            required: true,
            pattern: "^[0-9a-f]{32}$",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "use Symfony\\Component\\Validator\\Constraints as Assert;",
      );
      expect(result).toContain("#[Assert\\Regex(pattern: '/^[0-9a-f]{32}$/')]");
    });

    it("escapes single quotes in regex patterns", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "code",
            phpType: "string",
            nullable: false,
            required: true,
            pattern: "^[a-z]+'[a-z]+$",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "#[Assert\\Regex(pattern: '/^[a-z]+\\'[a-z]+$/')]",
      );
    });

    it("escapes backslashes in regex patterns", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "path",
            phpType: "string",
            nullable: false,
            required: true,
            pattern: "^\\d{3}-\\d{4}$",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "#[Assert\\Regex(pattern: '/^\\\\d{3}-\\\\d{4}$/')]",
      );
    });

    it("adds Assert\\Choice for enum properties", () => {
      const dto: DtoDefinition = {
        name: "CategoryDTO",
        properties: [
          {
            name: "type",
            phpType: "string",
            nullable: false,
            required: true,
            description: "Type of the category",
            enum: ["page", "link", "folder"],
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "use Symfony\\Component\\Validator\\Constraints as Assert;",
      );
      expect(result).toContain(
        "#[Assert\\Choice(choices: ['page', 'link', 'folder'])]",
      );
      expect(result).toContain("public string $type,");
    });

    it("adds Assert\\Choice for optional enum properties", () => {
      const dto: DtoDefinition = {
        name: "ProductDTO",
        properties: [
          {
            name: "productType",
            phpType: "string",
            nullable: true,
            required: false,
            enum: ["physical", "digital"],
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "#[Assert\\Choice(choices: ['physical', 'digital'])]",
      );
      expect(result).toContain("public ?string $productType = null,");
    });

    it("adds Assert import when only enums exist (no patterns)", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "status",
            phpType: "string",
            nullable: false,
            required: true,
            enum: ["active", "inactive"],
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "use Symfony\\Component\\Validator\\Constraints as Assert;",
      );
      expect(result).not.toContain("#[Assert\\Regex");
    });

    it("escapes single quotes in enum values", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "label",
            phpType: "string",
            nullable: false,
            required: true,
            enum: ["it's", "won't"],
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "#[Assert\\Choice(choices: ['it\\'s', 'won\\'t'])]",
      );
    });

    it("does not add Assert import when no constraints needed", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "name",
            phpType: "string",
            nullable: false,
            required: false,
            isArray: false,
          },
          {
            name: "label",
            phpType: "string",
            nullable: true,
            required: false,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).not.toContain("use Symfony");
      expect(result).not.toContain("Assert");
      expect(result).toContain("public ?string $name = null,");
      expect(result).toContain("public ?string $label = null,");
    });

    it("generates list<T> PHPDoc for typed arrays with description", () => {
      const dto: DtoDefinition = {
        name: "CartDTO",
        properties: [
          {
            name: "lineItems",
            phpType: "array",
            nullable: false,
            required: true,
            description: "All items within the cart",
            isArray: true,
            arrayItemType: "LineItemDTO",
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("/**");
      expect(result).toContain(
        "* @var list<LineItemDTO> All items within the cart",
      );
      expect(result).toContain("*/");
      expect(result).toContain("public array $lineItems,");
    });

    it("generates list<T> PHPDoc for typed arrays without description", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "items",
            phpType: "array",
            nullable: false,
            required: true,
            isArray: true,
            arrayItemType: "ProductDTO",
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("/**");
      expect(result).toContain("* @var list<ProductDTO>");
      expect(result).toContain("*/");
    });

    it("generates list<T> PHPDoc for nullable typed arrays", () => {
      const dto: DtoDefinition = {
        name: "OrderDTO",
        properties: [
          {
            name: "items",
            phpType: "array",
            nullable: true,
            required: false,
            description: "Order line items",
            isArray: true,
            arrayItemType: "LineItemDTO",
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("/**");
      expect(result).toContain("* @var list<LineItemDTO> Order line items");
      expect(result).toContain("*/");
      expect(result).toContain("public ?array $items = null,");
    });

    it("generates correct type hint for nested object DTO references", () => {
      const dto: DtoDefinition = {
        name: "SalesChannelContextDTO",
        properties: [
          {
            name: "itemRounding",
            phpType: "SalesChannelContextItemRoundingDTO",
            nullable: false,
            required: true,
            isArray: false,
          },
          {
            name: "currentCustomerGroup",
            phpType: "SalesChannelContextCurrentCustomerGroupDTO",
            nullable: true,
            required: false,
            description: "Customer group of the current user",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "public SalesChannelContextItemRoundingDTO $itemRounding,",
      );
      expect(result).toContain(
        "public ?SalesChannelContextCurrentCustomerGroupDTO $currentCustomerGroup = null,",
      );
      expect(result).toContain("/** Customer group of the current user */");
    });

    it("generates list<T> PHPDoc for arrays of nested object DTOs", () => {
      const dto: DtoDefinition = {
        name: "SalesChannelContextDTO",
        properties: [
          {
            name: "taxRules",
            phpType: "array",
            nullable: true,
            required: false,
            description: "Active tax rules",
            isArray: true,
            arrayItemType: "SalesChannelContextTaxRulesDTO",
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "* @var list<SalesChannelContextTaxRulesDTO> Active tax rules",
      );
      expect(result).toContain("public ?array $taxRules = null,");
    });

    it("renders string default value", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "sortOrder",
            phpType: "string",
            nullable: false,
            required: false,
            defaultValue: "relevance",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);
      expect(result).toContain("public string $sortOrder = 'relevance',");
    });

    it("renders integer default value", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "limit",
            phpType: "int",
            nullable: false,
            required: false,
            defaultValue: 10,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);
      expect(result).toContain("public int $limit = 10,");
    });

    it("renders boolean default value", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "active",
            phpType: "bool",
            nullable: false,
            required: false,
            defaultValue: true,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);
      expect(result).toContain("public bool $active = true,");
    });

    it("renders default on nullable property instead of null", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "mode",
            phpType: "string",
            nullable: true,
            required: false,
            defaultValue: "auto",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);
      expect(result).toContain("public ?string $mode = 'auto',");
      expect(result).not.toContain("= null");
    });

    it("renders nullable without default as = null", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "label",
            phpType: "string",
            nullable: true,
            required: false,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);
      expect(result).toContain("public ?string $label = null,");
    });

    it("escapes single quotes in string default values", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "greeting",
            phpType: "string",
            nullable: false,
            required: false,
            defaultValue: "it's",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);
      expect(result).toContain("public string $greeting = 'it\\'s',");
    });

    it("adds PreserveNull for schema-nullable properties", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "title",
            phpType: "string",
            nullable: true,
            required: false,
            isArray: false,
          },
          {
            name: "label",
            phpType: "string",
            nullable: false,
            required: false,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "#[PreserveNull]\n        public ?string $title",
      );
      expect(result).not.toContain(
        "#[PreserveNull]\n        public ?string $label",
      );
    });

    it("does not add PreserveNull for optional-only nullable fallback", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "name",
            phpType: "string",
            nullable: false,
            required: false,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("public ?string $name = null,");
      expect(result).not.toContain("#[PreserveNull]");
    });

    it("adds Assert\\Email for format: email", () => {
      const dto: DtoDefinition = {
        name: "UserDTO",
        properties: [
          {
            name: "email",
            phpType: "string",
            nullable: false,
            required: true,
            format: "email",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "use Symfony\\Component\\Validator\\Constraints as Assert;",
      );
      expect(result).toContain("#[Assert\\Email]");
      expect(result).toContain("#[Assert\\NotBlank]");
      expect(result).toContain("public string $email,");
    });

    it("adds Assert\\Uuid for format: uuid", () => {
      const dto: DtoDefinition = {
        name: "EntityDTO",
        properties: [
          {
            name: "id",
            phpType: "string",
            nullable: false,
            required: true,
            format: "uuid",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("#[Assert\\Uuid]");
    });

    it("adds Assert\\Url for format: uri", () => {
      const dto: DtoDefinition = {
        name: "LinkDTO",
        properties: [
          {
            name: "website",
            phpType: "string",
            nullable: false,
            required: false,
            format: "uri",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("#[Assert\\Url]");
    });

    it("adds Assert\\DateTime for format: date-time", () => {
      const dto: DtoDefinition = {
        name: "EventDTO",
        properties: [
          {
            name: "createdAt",
            phpType: "string",
            nullable: false,
            required: true,
            format: "date-time",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(
        "#[Assert\\DateTime(format: \\Shopware\\Core\\Defaults::STORAGE_DATE_TIME_FORMAT)]",
      );
    });

    it("adds Assert\\Date for format: date", () => {
      const dto: DtoDefinition = {
        name: "ProfileDTO",
        properties: [
          {
            name: "birthday",
            phpType: "string",
            nullable: false,
            required: false,
            format: "date",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("#[Assert\\Date]");
    });

    it("does not add format assert for unknown formats like int64 or uri-reference", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "fileSize",
            phpType: "int",
            nullable: false,
            required: false,
            format: "int64",
            isArray: false,
          },
          {
            name: "avatar",
            phpType: "string",
            nullable: false,
            required: false,
            format: "uri-reference",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).not.toContain("use Symfony");
      expect(result).not.toContain("Assert");
    });

    it("combines format assert with pattern and required asserts", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        properties: [
          {
            name: "email",
            phpType: "string",
            nullable: false,
            required: true,
            format: "email",
            pattern: "^.+@.+$",
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain("#[Assert\\NotBlank]");
      expect(result).toContain("#[Assert\\Email]");
      expect(result).toContain("#[Assert\\Regex(pattern: '/^.+@.+$/')]");
    });

    it("handles multiline description", () => {
      const dto: DtoDefinition = {
        name: "TestDTO",
        description: "Line one\nLine two",
        properties: [
          {
            name: "id",
            phpType: "string",
            nullable: false,
            required: true,
            isArray: false,
          },
        ],
      };

      const result = generatePhpClass(dto);

      expect(result).toContain(" * Line one");
      expect(result).toContain(" * Line two");
    });
  });

  describe("generatePreserveNullAttribute", () => {
    it("generates the attribute class", () => {
      const result = generatePreserveNullAttribute();

      expect(result).toContain("<?php declare(strict_types=1);");
      expect(result).toContain("namespace Attributes;");
      expect(result).toContain("#[\\Attribute(\\Attribute::TARGET_PROPERTY)]");
      expect(result).toContain("class PreserveNull");
    });

    it("includes base namespace with Attributes suffix when provided", () => {
      const result = generatePreserveNullAttribute({
        namespace: "App\\DTO",
      });

      expect(result).toContain("namespace App\\DTO\\Attributes;");
      expect(result).toContain("class PreserveNull");
    });
  });

  describe("generateAllFiles", () => {
    it("puts operation DTOs in root and component DTOs in DTO/", () => {
      const dtos: DtoDefinition[] = [
        {
          name: "ReadProductResponseDTO",
          source: "operation",
          properties: [
            {
              name: "id",
              phpType: "string",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
        {
          name: "ProductDTO",
          source: "component",
          properties: [
            {
              name: "name",
              phpType: "string",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
      ];

      const { files } = generateAllFiles(dtos);

      expect(files).toHaveLength(2);
      expect(files[0]?.fileName).toBe("ReadProductResponseDTO.php");
      expect(files[1]?.fileName).toBe("DTO/ProductDTO.php");
    });

    it("defaults to DTO/ when source is not set", () => {
      const dtos: DtoDefinition[] = [
        {
          name: "CartDTO",
          properties: [
            {
              name: "token",
              phpType: "string",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
      ];

      const { files } = generateAllFiles(dtos);

      expect(files).toHaveLength(1);
      expect(files[0]?.fileName).toBe("DTO/CartDTO.php");
    });

    it("without --namespace: component DTOs get namespace DTO, root DTOs get use imports", () => {
      const dtos: DtoDefinition[] = [
        {
          name: "RegisterRequestDTO",
          source: "operation",
          properties: [
            {
              name: "address",
              phpType: "CustomerAddressDTO",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
        {
          name: "CustomerAddressDTO",
          source: "component",
          properties: [
            {
              name: "country",
              phpType: "CountryDTO",
              nullable: false,
              required: false,
              isArray: false,
            },
          ],
        },
        {
          name: "CountryDTO",
          source: "component",
          properties: [
            {
              name: "name",
              phpType: "string",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
      ];

      const { files } = generateAllFiles(dtos);

      const requestContent = files[0]?.content ?? "";
      expect(requestContent).not.toContain("namespace ");
      expect(requestContent).toContain("use DTO\\CustomerAddressDTO;");

      const addressContent = files[1]?.content ?? "";
      expect(addressContent).toContain("namespace DTO;");
      expect(addressContent).toContain("use DTO\\CountryDTO;");

      const countryContent = files[2]?.content ?? "";
      expect(countryContent).toContain("namespace DTO;");
    });

    it("adds namespace and use imports with --namespace", () => {
      const dtos: DtoDefinition[] = [
        {
          name: "RegisterRequestDTO",
          source: "operation",
          properties: [
            {
              name: "address",
              phpType: "CustomerAddressDTO",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
        {
          name: "CustomerAddressDTO",
          source: "component",
          properties: [
            {
              name: "country",
              phpType: "CountryDTO",
              nullable: false,
              required: false,
              isArray: false,
            },
          ],
        },
        {
          name: "CountryDTO",
          source: "component",
          properties: [
            {
              name: "name",
              phpType: "string",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
      ];

      const { files } = generateAllFiles(dtos, { namespace: "App\\DTO" });

      const requestContent = files[0]?.content ?? "";
      expect(requestContent).toContain("namespace App\\DTO;");
      expect(requestContent).toContain(
        "use App\\DTO\\DTO\\CustomerAddressDTO;",
      );

      const addressContent = files[1]?.content ?? "";
      expect(addressContent).toContain("namespace App\\DTO\\DTO;");
      expect(addressContent).toContain("use App\\DTO\\DTO\\CountryDTO;");
    });

    it("operation DTOs keep base namespace, component DTOs get Shared suffix", () => {
      const dtos: DtoDefinition[] = [
        {
          name: "TestRequestDTO",
          source: "operation",
          properties: [
            {
              name: "id",
              phpType: "string",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
        {
          name: "TestDTO",
          source: "component",
          properties: [
            {
              name: "id",
              phpType: "string",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
      ];

      const { files } = generateAllFiles(dtos, { namespace: "App\\DTO" });

      expect(files[0]?.content).toContain("namespace App\\DTO;");
      expect(files[0]?.content).not.toContain("Shared");
      expect(files[1]?.content).toContain("namespace App\\DTO\\DTO;");
    });

    it("omits PreserveNull.php when no property is nullable", () => {
      const dtos: DtoDefinition[] = [
        {
          name: "SimpleDTO",
          source: "component",
          properties: [
            {
              name: "id",
              phpType: "string",
              nullable: false,
              required: true,
              isArray: false,
            },
          ],
        },
      ];

      const { files } = generateAllFiles(dtos);

      expect(
        files.every((f) => f.fileName !== "attributes/PreserveNull.php"),
      ).toBe(true);
    });

    it("includes PreserveNull.php when at least one property is nullable", () => {
      const dtos: DtoDefinition[] = [
        {
          name: "SimpleDTO",
          source: "component",
          properties: [
            {
              name: "label",
              phpType: "string",
              nullable: true,
              required: false,
              isArray: false,
            },
          ],
        },
      ];

      const { files } = generateAllFiles(dtos);

      expect(files[0]?.fileName).toBe("attributes/PreserveNull.php");
      expect(files[0]?.content).toContain("namespace Attributes;");
      expect(files[0]?.content).toContain("class PreserveNull");
    });

    it("generates PreserveNull import for component DTOs with namespace", () => {
      const dtos: DtoDefinition[] = [
        {
          name: "ProductDTO",
          source: "component",
          properties: [
            {
              name: "description",
              phpType: "string",
              nullable: true,
              required: false,
              isArray: false,
            },
          ],
        },
      ];

      const { files } = generateAllFiles(dtos, { namespace: "App\\DTO" });
      const productContent = files[1]?.content ?? "";

      expect(productContent).toContain("namespace App\\DTO\\DTO;");
      expect(productContent).toContain(
        "use App\\DTO\\Attributes\\PreserveNull;",
      );
      expect(productContent).toContain("#[PreserveNull]");
    });

    it("generates Assert\\Count for arrays with minItems", () => {
      const dto: DtoDefinition = {
        name: "TagsDTO",
        properties: [
          {
            name: "tags",
            phpType: "array",
            nullable: false,
            required: true,
            isArray: true,
            arrayItemType: "string",
            minItems: 1,
          },
          {
            name: "ids",
            phpType: "array",
            nullable: false,
            required: true,
            isArray: true,
            arrayItemType: "string",
            minItems: 3,
          },
          {
            name: "labels",
            phpType: "array",
            nullable: false,
            required: false,
            isArray: true,
            arrayItemType: "string",
          },
        ],
      };

      const output = generatePhpClass(dto);
      expect(output).toContain("#[Assert\\Count(min: 1)]");
      expect(output).toContain("#[Assert\\Count(min: 3)]");
      expect(output).not.toMatch(/labels[\s\S]*?#\[Assert\\Count/);
    });

    it("generates Assert\\All with Assert\\Type for primitive array items", () => {
      const dto: DtoDefinition = {
        name: "MixedArraysDTO",
        properties: [
          {
            name: "names",
            phpType: "array",
            nullable: false,
            required: true,
            isArray: true,
            arrayItemType: "string",
          },
          {
            name: "counts",
            phpType: "array",
            nullable: false,
            required: false,
            isArray: true,
            arrayItemType: "int",
          },
          {
            name: "prices",
            phpType: "array",
            nullable: false,
            required: false,
            isArray: true,
            arrayItemType: "float",
          },
          {
            name: "flags",
            phpType: "array",
            nullable: false,
            required: false,
            isArray: true,
            arrayItemType: "bool",
          },
          {
            name: "items",
            phpType: "array",
            nullable: false,
            required: false,
            isArray: true,
            arrayItemType: "LineItemDTO",
          },
          {
            name: "untyped",
            phpType: "array",
            nullable: false,
            required: false,
            isArray: true,
          },
        ],
      };

      const output = generatePhpClass(dto);
      expect(output).toContain("#[Assert\\All(new Assert\\Type('string'))]");
      expect(output).toContain("#[Assert\\All(new Assert\\Type('int'))]");
      expect(output).toContain("#[Assert\\All(new Assert\\Type('float'))]");
      expect(output).toContain("#[Assert\\All(new Assert\\Type('bool'))]");
      expect(output).not.toContain("Type('LineItemDTO')");
      expect(output).not.toMatch(/untyped[\s\S]*?#\[Assert\\All/);
    });

    it("generates Assert\\All with NotBlank when arrayItemMinLength >= 1", () => {
      const dto: DtoDefinition = {
        name: "ItemMinLengthDTO",
        properties: [
          {
            name: "vatIds",
            phpType: "array",
            nullable: false,
            required: true,
            isArray: true,
            arrayItemType: "string",
            minItems: 1,
            arrayItemMinLength: 1,
          },
          {
            name: "tags",
            phpType: "array",
            nullable: false,
            required: true,
            isArray: true,
            arrayItemType: "string",
          },
        ],
      };

      const output = generatePhpClass(dto);
      expect(output).toContain(
        "#[Assert\\All([new Assert\\Type('string'), new Assert\\NotBlank])]",
      );
      const tagsSection = output.slice(output.indexOf("$tags"));
      expect(tagsSection).not.toContain("NotBlank");
    });
  });
});
