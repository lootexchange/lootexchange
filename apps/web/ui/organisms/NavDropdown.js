import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Pane, Box, P, Flex, Avatar } from "@ui";

const NavDropdown = ({ button, items, ...props }) => {
  return (
    <Box {...props}>
      <Menu as="div" style={{ position: "relative" }}>
        <Menu.Button>{button}</Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items
            style={{ position: "absolute", top: 40, left: 0, zIndex: 100 }}
          >
            <Pane
              bg="#0d0d0d"
              style={{
                boxShadow: "0px 5px 20px 6px black",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
              width={420}
            >
              {items.map((item, i) => (
                <Menu.Item key={item.href}>
                  <Link href={item.href}>
                    <a>
                      <Flex
                        p={3}
                        alignItems="center"
                        borderTop={
                          i !== 0 ? "1px solid rgba(255,255,255, 0.2)" : "none"
                        }
                      >
                        <Box mr={3}>
                          <img
                            src={item.image}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: "50%"
                            }}
                          />
                        </Box>
                        <Box>
                          <P>{item.label}</P>
                        </Box>
                      </Flex>
                    </a>
                  </Link>
                </Menu.Item>
              ))}
            </Pane>
          </Menu.Items>
        </Transition>
      </Menu>
    </Box>
  );
};

export default NavDropdown;
